/**
 * COSMOS Status Router
 *
 * GET  /api/cosmos/status    — HTTP snapshot (Captain Dashboard primary feed).
 * GET  /api/cosmos/ws-info   — Returns WebSocket connection details for the frontend.
 * GET  /api/cosmos/log       — Mission status log (last 50 entries).
 *
 * The real-time feed is the WebSocket endpoint:
 *   ws(s)://your-host/api/ws/cosmos
 *
 * REST contract (unchanged — backward compatible with existing frontend):
 *   { active_mission, progress, system_resonance }
 *   plus extended cosmos context for the health panel.
 */

import { Router } from "express";
import { neuralGrid } from "../services/neuralGrid.js";
import { tokenBudget } from "../services/tokenBudget.js";
import { cosmosHub } from "../ws/cosmosHub.js";

const router = Router();

// ── GET /api/cosmos/status ────────────────────────────────────────────────────

router.get("/cosmos/status", (_req, res) => {
  const mission      = neuralGrid.getActiveMission();
  const agents       = neuralGrid.listAgents();
  const budget       = tokenBudget.getSnapshot();
  const onlineAgents = agents.filter((a) => a.status !== "offline").length;

  res.json({
    // ── Captain Dashboard canonical contract ──────────────────────────────
    active_mission:   mission.name,
    progress:         mission.progress,
    system_resonance: mission.systemResonance,
    // ── Extended COSMOS context ───────────────────────────────────────────
    cosmos: {
      version:        "5.0.0",
      dimension:      mission.activeDimension,
      mission_status: mission.status,
      agents_online:  onlineAgents,
      agents_total:   agents.length,
      ws_clients:     cosmosHub.connectionCount,
      token_health: Object.fromEntries(
        Object.entries(budget).map(([id, b]) => [
          id,
          {
            percent_remaining: 100 - b.percentUsed,
            status:
              b.percentUsed > 90 ? "critical" :
              b.percentUsed > 70 ? "warning"  : "healthy",
          },
        ]),
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

// ── GET /api/cosmos/ws-info ───────────────────────────────────────────────────
// Returns WebSocket connection details so the frontend can discover the WS URL
// without hardcoding it.  The frontend should derive wss:// from the API base URL.

router.get("/cosmos/ws-info", (_req, res) => {
  res.json({
    ws_endpoint:    "/api/ws/cosmos",
    protocol:       "wss (use ws in local dev without TLS)",
    connected_clients: cosmosHub.connectionCount,
    // Events the server emits (subscribe guide):
    events: [
      {
        type:        "cosmos:status",
        frequency:   "every 10 s + on agent dispatch completion",
        description: "Full Captain Dashboard snapshot: active_mission, progress, system_resonance, token_health.",
      },
      {
        type:        "agent:dispatch_start",
        frequency:   "on every dispatch call",
        description: "Fired immediately when an agent begins processing a task.",
      },
      {
        type:        "agent:thought",
        frequency:   "once per Gemini response (including tool-call loop iterations)",
        description: "Live agent thought stream: agentId, thought text, step number, running token count.",
      },
      {
        type:        "agent:dispatch_complete",
        frequency:   "on dispatch completion",
        description: "Final result: response text, tokensUsed, fallback flag, toolCallsExecuted.",
      },
      {
        type:        "token:update",
        frequency:   "on any budget change",
        description: "Full token budget snapshot for all agents.",
      },
      {
        type:        "pong",
        frequency:   "in response to client { type: 'ping' }",
        description: "Application-level pong — distinct from WebSocket protocol ping frames.",
      },
    ],
    // Client → Server:
    client_messages: [
      { type: "ping", description: "Send { type: 'ping' } to receive a pong and verify connection liveness." },
    ],
    timestamp: new Date().toISOString(),
  });
});

// ── GET /api/cosmos/log ───────────────────────────────────────────────────────

router.get("/cosmos/log", (_req, res) => {
  const log = neuralGrid.getMissionLog();
  // Return newest first, capped at 50 entries.
  res.json({
    entries: log.slice(-50).reverse(),
    total:   log.length,
    timestamp: new Date().toISOString(),
  });
});

export default router;
