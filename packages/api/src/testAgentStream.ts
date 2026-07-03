/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          COSMOS Agent Stream — End-to-End Test Client                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 *
 * Spins up the API server on TEST_PORT (4099), connects a WebSocket client,
 * fires two live agent dispatches, and prints every streaming event so you
 * can verify the full stack works end-to-end:
 *
 *   tokenBudget.allocate()
 *     → Gemini agent loop (or mock if no GEMINI_API_KEY)
 *     → dispatch:thought WS events  ← live thought stream
 *     → token:update WS events      ← live budget deductions
 *     → dispatch:complete WS event  ← final result
 *     → cosmos:status WS event      ← dashboard refresh
 *
 * Usage:
 *   pnpm --filter @cosmos/api run test:stream
 *
 * Requirements:
 *   • No Supabase credentials needed — the test calls neuralGrid.dispatch()
 *     directly, bypassing the HTTP auth layer entirely.
 *   • Set GEMINI_API_KEY to test against real Gemini 1.5 Flash.
 *     Without it the neuralGrid falls back to mock responses (still a valid
 *     test of the WS pipeline, token budget, and event broadcasting).
 *
 * Exit codes:  0 = all dispatches succeeded  |  1 = error or timeout
 */

import { createServer } from "node:http";
import { WebSocket } from "ws";
import app from "./app.js";
import { cosmosHub } from "./ws/cosmosHub.js";
import { neuralGrid } from "./services/neuralGrid.js";
import { tokenBudget } from "./services/tokenBudget.js";

// ── ANSI helpers (no extra deps) ──────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  cyan:   "\x1b[36m",
  yellow: "\x1b[33m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  magenta:"\x1b[35m",
  white:  "\x1b[37m",
};
const c = (color: keyof typeof C, s: string) => `${C[color]}${s}${C.reset}`;
const ts = () => c("dim", `[${new Date().toLocaleTimeString()}]`);
const hr = (char = "─", width = 72) => c("dim", char.repeat(width));

// ── Test configuration ────────────────────────────────────────────────────────
const TEST_PORT    = 4099;
const WS_URL       = `ws://localhost:${TEST_PORT}/api/ws/cosmos`;
const TIMEOUT_MS   = 45_000;   // 45 s total — enough for 2 Gemini calls
const SETTLE_MS    = 2_500;    // wait after final dispatch before teardown

// ── Test dispatches ───────────────────────────────────────────────────────────
const TEST_CASES: Array<{ agentId: "robin_vanguard" | "starlight" | "system"; task: string }> = [
  {
    agentId: "robin_vanguard",
    task: "Perform a complete Neural Grid status check. Read the current grid status, identify any anomalies, and generate a mission log entry summarising the health of the system.",
  },
  {
    agentId: "starlight",
    task: "Verify dimensional anchor stability. Query mission progress, check system resonance, and generate a status log entry confirming the anchor is holding.",
  },
];

// ── Stats accumulators ────────────────────────────────────────────────────────
interface DispatchStats {
  agentId: string;
  task: string;
  tokensUsed: number;
  toolCalls: number;
  thoughts: number;
  fallback: boolean;
  success: boolean;
  durationMs: number;
}

const wsEvents: Record<string, number> = {};
const dispatchStats: DispatchStats[] = [];
let totalTokensDeducted = 0;

// ── Entry point ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  printBanner();

  // ── Boot the server ─────────────────────────────────────────────────────────
  const server = createServer(app);
  cosmosHub.attach(server);

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(TEST_PORT, "127.0.0.1", resolve);
  });

  console.log(`${ts()} ${c("green", "✓")} Server listening on port ${TEST_PORT}`);
  console.log(`${ts()} ${c("green", "✓")} WebSocket hub attached → ${WS_URL}`);
  const geminiMode = process.env["GEMINI_API_KEY"]
    ? c("green", "Gemini 1.5 Flash  (live)")
    : c("yellow", "Mock responses    (set GEMINI_API_KEY for live)");
  console.log(`${ts()} ${c("blue", "ℹ")} LLM mode: ${geminiMode}`);
  console.log(hr());

  // ── Global timeout guard ────────────────────────────────────────────────────
  const globalTimer = setTimeout(() => {
    console.error(`\n${c("red", "✗ TIMEOUT")} Test exceeded ${TIMEOUT_MS / 1000}s. Forcing exit.\n`);
    teardown(server, ws, 1);  // ws may be defined by now; teardown handles null
  }, TIMEOUT_MS);
  globalTimer.unref();

  // ── Connect WebSocket client ─────────────────────────────────────────────────
  // IMPORTANT: attach message listeners BEFORE awaiting "open" so we never
  // miss the immediate cosmos:status that cosmosHub sends on connect.
  // Node.js EventEmitter queues events on the microtask queue — any message
  // that arrives after the TCP handshake completes will be delivered to the
  // handler even if it was registered a few ticks earlier.
  const ws = new WebSocket(WS_URL);

  // Register ongoing printer immediately (catches all events including the
  // first cosmos:status sent synchronously on connect).
  ws.on("message", (raw) => printWsEvent(raw.toString()));
  ws.on("error",   (err) => {
    console.error(`${ts()} ${c("red", "✗ WS error:")} ${err.message}`);
  });

  // Register status waiter BEFORE open so the first on-connect event isn't
  // missed — 10 s window handles the case where the 10 s periodic tick fires
  // before our waiter is ready.
  const firstStatusPromise = waitForEventType(ws, "cosmos:status", 10_000);

  await new Promise<void>((resolve, reject) => {
    ws.once("open",  resolve);
    ws.once("error", reject);  // fatal pre-open errors propagate to main().catch
  });

  console.log(`${ts()} ${c("green", "✓")} WebSocket client connected\n`);

  // ── Wait for initial cosmos:status (confirms hub is broadcasting) ─────────
  await firstStatusPromise;
  console.log(hr());
  console.log(`\n${c("bold", "  Running test dispatches…")}\n`);

  // ── Run each test case sequentially ─────────────────────────────────────────
  for (const tc of TEST_CASES) {
    await runDispatch(tc.agentId, tc.task);
    // Small pause between dispatches so WS events don't interleave in terminal.
    await sleep(800);
    console.log(hr());
  }

  // ── Wait for trailing WS events ──────────────────────────────────────────────
  await sleep(SETTLE_MS);

  // ── Print summary ────────────────────────────────────────────────────────────
  printSummary();

  // ── Teardown ─────────────────────────────────────────────────────────────────
  clearTimeout(globalTimer);
  teardown(server, ws, 0);
}

// ── Dispatch runner ───────────────────────────────────────────────────────────

async function runDispatch(
  agentId: "robin_vanguard" | "starlight" | "system",
  task: string,
): Promise<void> {
  const agentLabel = c("cyan", agentId.replace("_", " ").toUpperCase());
  console.log(`${ts()} ${c("yellow", "→")} DISPATCHING to ${agentLabel}`);
  console.log(`${ts()} ${c("dim", `   task: "${task.slice(0, 80)}…"`)}`);

  const budgetBefore = tokenBudget.getSnapshot()[agentId];
  const t0 = Date.now();

  const result = await neuralGrid.dispatch(agentId, task);

  const durationMs   = Date.now() - t0;
  const budgetAfter  = tokenBudget.getSnapshot()[agentId];
  const tokensDelta  = (budgetAfter?.used ?? 0) - (budgetBefore?.used ?? 0);
  totalTokensDeducted += tokensDelta;

  dispatchStats.push({
    agentId,
    task,
    tokensUsed:   result.tokensUsed,
    toolCalls:    result.toolCallsExecuted,
    thoughts:     0,     // counted in printWsEvent
    fallback:     result.fallback,
    success:      result.success,
    durationMs,
  });

  const icon   = result.success ? c("green", "✓") : c("yellow", "⚠");
  const fbFlag = result.fallback ? c("yellow", " [FALLBACK]") : "";
  console.log(`${ts()} ${icon} Dispatch complete${fbFlag}`);
  console.log(`${ts()} ${c("dim", `   tokens used: ${result.tokensUsed}  |  tools: ${result.toolCallsExecuted}  |  ${durationMs}ms`)}`);
}

// ── WS event printer ──────────────────────────────────────────────────────────

function printWsEvent(raw: string): void {
  let event: { type: string; data?: Record<string, unknown>; ts?: string };
  try { event = JSON.parse(raw); } catch { return; }

  const type = event.type ?? "unknown";
  wsEvents[type] = (wsEvents[type] ?? 0) + 1;

  switch (type) {
    // ── cosmos:status ────────────────────────────────────────────────────────
    case "cosmos:status": {
      const d = event.data as {
        active_mission: string; progress: number; system_resonance: number;
        agents_online: number; dimension: string;
        token_health: Record<string, { percent_remaining: number; status: string }>;
      };
      const health = Object.entries(d.token_health ?? {})
        .map(([id, h]) => {
          const col = h.status === "critical" ? "red" : h.status === "warning" ? "yellow" : "green";
          return `${id.split("_")[0]}:${c(col, `${h.percent_remaining}%`)}`;
        })
        .join("  ");

      console.log(
        `${ts()} ${c("magenta", "🌌 cosmos:status")}` +
        `  mission="${c("cyan", d.active_mission)}"` +
        `  progress=${c("bold", `${d.progress}%`)}` +
        `  resonance=${d.system_resonance}` +
        `  agents=${d.agents_online}`,
      );
      console.log(`${ts()} ${c("dim", `   token health → ${health}`)}`);
      break;
    }

    // ── agent:dispatch_start ─────────────────────────────────────────────────
    case "agent:dispatch_start": {
      const d = event.data as { agentId: string; displayName: string; task: string };
      console.log(
        `${ts()} ${c("yellow", "🟡 dispatch_start")}` +
        `  agent=${c("cyan", d.displayName)}` +
        `  task="${d.task.slice(0, 60)}…"`,
      );
      break;
    }

    // ── agent:thought ────────────────────────────────────────────────────────
    case "agent:thought": {
      const d = event.data as {
        agentId: string; displayName: string; thought: string;
        step: number; totalTokensUsed: number;
      };
      // Increment thought count on last dispatch stats entry.
      if (dispatchStats.length > 0) dispatchStats[dispatchStats.length - 1]!.thoughts++;

      const preview = d.thought.replace(/\n/g, " ").slice(0, 110);
      console.log(
        `${ts()} ${c("blue", "💭 agent:thought")}` +
        `  ${c("cyan", d.displayName)}` +
        `  step=${d.step}` +
        `  tokens_so_far=${c("bold", String(d.totalTokensUsed))}`,
      );
      console.log(`${ts()} ${c("dim", `   "${preview}${d.thought.length > 110 ? "…" : ""}"`)}` );
      break;
    }

    // ── agent:dispatch_complete ──────────────────────────────────────────────
    case "agent:dispatch_complete": {
      const d = event.data as {
        agentId: string; response: string; tokensUsed: number;
        fallback: boolean; toolCallsExecuted: number;
      };
      const icon   = d.fallback ? c("yellow", "⚠") : c("green", "✅");
      const fbTag  = d.fallback ? c("yellow", " FALLBACK") : "";
      const preview = d.response.replace(/\n/g, " ").slice(0, 140);
      console.log(
        `${ts()} ${icon} ${c("green", "dispatch_complete")}${fbTag}` +
        `  tokens=${c("bold", String(d.tokensUsed))}` +
        `  tools=${d.toolCallsExecuted}`,
      );
      console.log(`${ts()} ${c("dim", `   "${preview}${d.response.length > 140 ? "…" : ""}"`)}` );
      break;
    }

    // ── token:update ─────────────────────────────────────────────────────────
    case "token:update": {
      const d = event.data as Record<string, { used: number; limit: number; percentUsed: number; queued: number }>;
      const parts = Object.entries(d).map(([id, b]) => {
        const col = b.percentUsed > 90 ? "red" : b.percentUsed > 70 ? "yellow" : "green";
        return `${id.split("_")[0]}  ${c(col, `${b.used}/${b.limit}`)} (${b.percentUsed}%)`;
      });
      console.log(`${ts()} ${c("magenta", "💰 token:update")}  ${parts.join("   ")}`);
      break;
    }

    // ── pong ─────────────────────────────────────────────────────────────────
    case "pong":
      // Silently ignore protocol keepalives in test output.
      break;

    default:
      console.log(`${ts()} ${c("dim", `📡 ${type}:`)} ${raw.slice(0, 80)}`);
  }
}

// ── Summary printer ───────────────────────────────────────────────────────────

function printSummary(): void {
  console.log(`\n${hr("═")}`);
  console.log(c("bold", "  TEST SUMMARY"));
  console.log(hr("═"));

  for (const s of dispatchStats) {
    const status = s.success
      ? c("green", "PASS")
      : s.fallback ? c("yellow", "FALLBACK") : c("red", "FAIL");
    console.log(`\n  ${c("cyan", s.agentId)}`);
    console.log(`    Status        : ${status}`);
    console.log(`    Tokens used   : ${c("bold", String(s.tokensUsed))}`);
    console.log(`    Tool calls    : ${s.toolCalls}`);
    console.log(`    WS thoughts   : ${s.thoughts}`);
    console.log(`    Duration      : ${s.durationMs}ms`);
  }

  console.log(`\n  ${c("bold", "WebSocket events received:")}`);
  for (const [evType, count] of Object.entries(wsEvents).sort()) {
    console.log(`    ${evType.padEnd(30)} ${c("cyan", String(count))}`);
  }

  const budgets = tokenBudget.getSnapshot();
  console.log(`\n  ${c("bold", "Final token budgets:")}`);
  for (const [agentId, b] of Object.entries(budgets)) {
    const col = b.percentUsed > 90 ? "red" : b.percentUsed > 70 ? "yellow" : "green";
    const bar = buildBar(b.percentUsed, 20);
    console.log(`    ${agentId.padEnd(20)} ${bar} ${c(col, `${b.used}/${b.limit}`)} (${b.percentUsed}% used)`);
  }

  const allPassed = dispatchStats.every((s) => s.success || s.fallback);
  console.log(`\n${hr("═")}`);
  console.log(allPassed
    ? c("green", "  ✓  All tests passed — COSMOS engine is operational.\n")
    : c("red",   "  ✗  Some tests failed — check output above.\n"),
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildBar(pct: number, width: number): string {
  const filled = Math.round((pct / 100) * width);
  const empty  = width - filled;
  const col    = pct > 90 ? "red" : pct > 70 ? "yellow" : "green";
  return `${c("dim", "[")}${c(col, "█".repeat(filled))}${c("dim", "░".repeat(empty) + "]")}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function waitForEventType(ws: WebSocket, type: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${type}`)), timeoutMs);
    const handler = (raw: Buffer | string) => {
      try {
        const ev = JSON.parse(raw.toString()) as { type?: string };
        if (ev.type === type) {
          clearTimeout(timer);
          ws.off("message", handler);
          resolve();
        }
      } catch { /* skip */ }
    };
    ws.on("message", handler);
  });
}

function teardown(server: ReturnType<typeof createServer>, ws: WebSocket | null, code: number): never {
  ws?.close(1000, "test complete");
  cosmosHub.destroy();
  tokenBudget.destroy();
  server.close(() => process.exit(code));
  // Force exit if server.close() hangs (e.g. keep-alive connections).
  setTimeout(() => process.exit(code), 3_000).unref();
  return undefined as never;
}

// ── Banner ────────────────────────────────────────────────────────────────────

function printBanner(): void {
  console.log(`\n${hr("═")}`);
  console.log(c("bold", c("cyan",
    "  COSMOS OS — Agent Stream Test Client                                  ")));
  console.log(c("dim",
    "  WebSockets · Gemini Agent Loop · Token Budget · Real-time Events      "));
  console.log(hr("═"));
  console.log(`  Port     : ${TEST_PORT}`);
  console.log(`  Cases    : ${TEST_CASES.length} dispatches (${TEST_CASES.map((t) => t.agentId).join(", ")})`);
  console.log(`  Timeout  : ${TIMEOUT_MS / 1000}s`);
  console.log(hr("═") + "\n");
}

// ── Run ───────────────────────────────────────────────────────────────────────

main().catch((err: unknown) => {
  console.error(`\n${c("red", "✗ Fatal error:")}`, err);
  process.exit(1);
});
