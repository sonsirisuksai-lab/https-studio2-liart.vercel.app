/**
 * Token Budget Tracker — COSMOS Core
 *
 * Tracks per-agent token usage, enforces hard budget limits, and queues requests
 * that would exceed the current limit so they're served once tokens free up.
 *
 * Changes from v1:
 *   • onBudgetChange(cb) — reactive subscription used by CosmosHub to broadcast
 *     token:update events over WebSocket whenever usage changes.
 *   • Listener notifications are batched: a single micro-task flush replaces the
 *     previous call-site approach so callers don't have to remember to notify.
 *
 * Environment variables (set in .env or Replit Secrets):
 *   TOKEN_LIMIT_ROBIN    — default 8 000
 *   TOKEN_LIMIT_STARLIGHT — default 12 000
 *   TOKEN_LIMIT_SYSTEM   — default 4 000
 */

export type AgentId = "robin_vanguard" | "starlight" | "system";

interface BudgetEntry {
  used: number;
  limit: number;
  queued: number;
}

interface QueuedRequest {
  requestId: string;
  agentId: AgentId;
  estimatedTokens: number;
  resolve: (value: TokenAllocation) => void;
  timeoutHandle: ReturnType<typeof setTimeout>;
}

export interface TokenAllocation {
  granted: boolean;
  tokensAvailable: number;
  agentId: AgentId;
  fallback: boolean;
  message?: string;
}

export type BudgetSnapshot = Record<
  AgentId,
  { used: number; limit: number; percentUsed: number; queued: number }
>;

type BudgetChangeListener = (snapshot: BudgetSnapshot) => void;

// ── Helpers ───────────────────────────────────────────────────────────────────

function readLimit(envKey: string, defaultValue: number): number {
  const v = parseInt(process.env[envKey] ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : defaultValue;
}

const DEFAULT_LIMITS: Record<AgentId, number> = {
  robin_vanguard: readLimit("TOKEN_LIMIT_ROBIN", 8_000),
  starlight:      readLimit("TOKEN_LIMIT_STARLIGHT", 12_000),
  system:         readLimit("TOKEN_LIMIT_SYSTEM", 4_000),
};

const QUEUE_TIMEOUT_MS = 15_000;

let _requestCounter = 0;
function newRequestId(): string {
  return `req-${++_requestCounter}-${Date.now()}`;
}

// ── Service ───────────────────────────────────────────────────────────────────

class TokenBudgetService {
  private budgets: Map<AgentId, BudgetEntry> = new Map();
  private queue: QueuedRequest[] = [];
  private drainInterval: ReturnType<typeof setInterval> | null = null;

  /** Reactive listeners (e.g. CosmosHub for WS broadcasts). */
  private listeners: Set<BudgetChangeListener> = new Set();

  /** Debounce flag: we flush at most once per microtask tick. */
  private _notifyPending = false;

  constructor() {
    for (const [id, limit] of Object.entries(DEFAULT_LIMITS)) {
      this.budgets.set(id as AgentId, { used: 0, limit, queued: 0 });
    }
    this.drainInterval = setInterval(() => this._drainQueue(), 5_000);

    const cleanup = (): void => this.destroy();
    process.once("exit", cleanup);
    process.once("SIGTERM", cleanup);
    process.once("SIGINT", cleanup);
  }

  // ── Allocation ─────────────────────────────────────────────────────────────

  /**
   * Request a token allocation for a specific agent.
   * If sufficient budget is available, it's reserved immediately.
   * Otherwise the request is queued for up to QUEUE_TIMEOUT_MS, then falls back.
   */
  async allocate(agentId: AgentId, estimatedTokens: number): Promise<TokenAllocation> {
    const entry = this._ensureEntry(agentId);

    if (entry.used + estimatedTokens <= entry.limit) {
      entry.used += estimatedTokens;
      this._scheduleNotify();
      return {
        granted: true,
        tokensAvailable: entry.limit - entry.used,
        agentId,
        fallback: false,
      };
    }

    // Budget exceeded — enqueue and wait.
    return new Promise<TokenAllocation>((resolve) => {
      const requestId = newRequestId();
      const timeoutHandle = setTimeout(() => {
        this._removeRequestById(requestId);
        resolve(this._fallbackAllocation(agentId));
      }, QUEUE_TIMEOUT_MS);

      this.queue.push({ requestId, agentId, estimatedTokens, resolve, timeoutHandle });
      entry.queued += 1;
      this._scheduleNotify();
    });
  }

  /**
   * Return unused tokens after an LLM call completes.
   * Call with (allocated - actual) to correct the over-estimate.
   */
  release(agentId: AgentId, savedTokens: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - savedTokens);
    this._scheduleNotify();
    this._drainQueue();
  }

  /**
   * Charge additional tokens beyond a prior allocation.
   *
   * Use when actual LLM usage exceeds the pre-allocation estimate so the
   * snapshot reflects true cumulative consumption.  Does NOT gate on the
   * budget limit — the slot was already granted; this only corrects the
   * accounting so future allocations see the real balance.
   */
  charge(agentId: AgentId, extraTokens: number): void {
    if (extraTokens <= 0) return;
    const entry = this._ensureEntry(agentId);
    entry.used += extraTokens;
    this._scheduleNotify();
  }

  /** Refill an agent's budget by `amount` tokens (or fully reset if omitted). */
  refill(agentId: AgentId, amount?: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - (amount ?? entry.limit));
    this._scheduleNotify();
    this._drainQueue();
  }

  // ── Snapshot ───────────────────────────────────────────────────────────────

  getSnapshot(): BudgetSnapshot {
    const snap: Record<string, BudgetSnapshot[AgentId]> = {};
    for (const [id, entry] of this.budgets.entries()) {
      snap[id] = {
        used:        entry.used,
        limit:       entry.limit,
        percentUsed: Math.round((entry.used / entry.limit) * 100),
        queued:      entry.queued,
      };
    }
    return snap as BudgetSnapshot;
  }

  // ── Reactive subscription ──────────────────────────────────────────────────

  /**
   * Register a listener that fires whenever the budget changes.
   * Returns an unsubscribe function — call it in destroy() of the subscriber.
   *
   * @example
   *   const unsub = tokenBudget.onBudgetChange((snap) => ws.broadcast(snap));
   *   // later:
   *   unsub();
   */
  onBudgetChange(cb: BudgetChangeListener): () => void {
    this.listeners.add(cb);
    return () => { this.listeners.delete(cb); };
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  destroy(): void {
    if (this.drainInterval) {
      clearInterval(this.drainInterval);
      this.drainInterval = null;
    }
    for (const req of this.queue) {
      clearTimeout(req.timeoutHandle);
      req.resolve(this._fallbackAllocation(req.agentId));
    }
    this.queue = [];
    this.listeners.clear();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private _ensureEntry(agentId: AgentId): BudgetEntry {
    if (!this.budgets.has(agentId)) {
      this.budgets.set(agentId, { used: 0, limit: DEFAULT_LIMITS.system, queued: 0 });
    }
    return this.budgets.get(agentId)!;
  }

  private _drainQueue(): void {
    const remaining: QueuedRequest[] = [];
    for (const req of this.queue) {
      const entry = this._ensureEntry(req.agentId);
      if (entry.used + req.estimatedTokens <= entry.limit) {
        entry.used += req.estimatedTokens;
        entry.queued = Math.max(0, entry.queued - 1);
        clearTimeout(req.timeoutHandle);
        req.resolve({
          granted: true,
          tokensAvailable: entry.limit - entry.used,
          agentId: req.agentId,
          fallback: false,
          message: "Granted from queue after token refill",
        });
      } else {
        remaining.push(req);
      }
    }
    this.queue = remaining;
  }

  private _removeRequestById(requestId: string): void {
    const idx = this.queue.findIndex((r) => r.requestId === requestId);
    if (idx !== -1) {
      const [removed] = this.queue.splice(idx, 1);
      const entry = this._ensureEntry(removed!.agentId);
      entry.queued = Math.max(0, entry.queued - 1);
      this._scheduleNotify();
    }
  }

  private _fallbackAllocation(agentId: AgentId): TokenAllocation {
    return {
      granted: false,
      tokensAvailable: 0,
      agentId,
      fallback: true,
      message: "Token budget exhausted — falling back to cached response.",
    };
  }

  /**
   * Batch notifications: listeners fire once per microtask tick regardless of
   * how many budget mutations happen within the same synchronous call chain.
   */
  private _scheduleNotify(): void {
    if (this._notifyPending) return;
    this._notifyPending = true;
    queueMicrotask(() => {
      this._notifyPending = false;
      if (this.listeners.size === 0) return;
      const snap = this.getSnapshot();
      for (const cb of this.listeners) {
        try { cb(snap); } catch { /* listeners must not crash the budget service */ }
      }
    });
  }
}

export const tokenBudget = new TokenBudgetService();
