/**
 * Token Budget Tracker — COSMOS Core
 *
 * Tracks per-agent token usage, enforces budget limits, and maintains a
 * request queue so we never hit a hard out-of-tokens failure mid-mission.
 */

export type AgentId = "robin_vanguard" | "starlight" | "system";

interface BudgetEntry {
  used: number;
  limit: number;
  queued: number;
}

interface QueuedRequest {
  requestId: string; // unique per request — used for precise removal
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

// Default budgets (tokens). In production, swap with real LLM quota values.
const DEFAULT_LIMITS: Record<AgentId, number> = {
  robin_vanguard: 8_000,
  starlight: 12_000,
  system: 4_000,
};

const QUEUE_TIMEOUT_MS = 15_000; // Max time a request can wait in the queue

let _requestCounter = 0;
function newRequestId(): string {
  return `req-${++_requestCounter}-${Date.now()}`;
}

class TokenBudgetService {
  private budgets: Map<AgentId, BudgetEntry> = new Map();
  private queue: QueuedRequest[] = [];
  private drainInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    for (const [id, limit] of Object.entries(DEFAULT_LIMITS)) {
      this.budgets.set(id as AgentId, { used: 0, limit, queued: 0 });
    }
    // Drain the queue every 5 s (simulates token refill / next billing window)
    this.drainInterval = setInterval(() => this._drainQueue(), 5_000);

    // Clean up on process exit so tests / hot-reload don't leak the interval
    const cleanup = () => this.destroy();
    process.once("exit", cleanup);
    process.once("SIGTERM", cleanup);
    process.once("SIGINT", cleanup);
  }

  /** Request a token allocation for an agent task. */
  async allocate(agentId: AgentId, estimatedTokens: number): Promise<TokenAllocation> {
    const entry = this._ensureEntry(agentId);

    if (entry.used + estimatedTokens <= entry.limit) {
      entry.used += estimatedTokens;
      return {
        granted: true,
        tokensAvailable: entry.limit - entry.used,
        agentId,
        fallback: false,
      };
    }

    // Over budget — queue the request and wait for a drain cycle
    return new Promise<TokenAllocation>((resolve) => {
      const requestId = newRequestId();

      const timeoutHandle = setTimeout(() => {
        // Remove only THIS specific request (by unique requestId), not all
        // requests from the same agent
        this._removeRequestById(requestId);
        resolve(this._fallbackAllocation(agentId));
      }, QUEUE_TIMEOUT_MS);

      this.queue.push({ requestId, agentId, estimatedTokens, resolve, timeoutHandle });
      entry.queued += 1;
    });
  }

  /** Release tokens after a task completes (e.g., actual usage < estimate). */
  release(agentId: AgentId, savedTokens: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - savedTokens);
    this._drainQueue();
  }

  /** Simulate a partial refill (call on billing window reset or mock tick). */
  refill(agentId: AgentId, amount?: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - (amount ?? entry.limit));
    this._drainQueue();
  }

  /** Snapshot of current usage for all agents. */
  getSnapshot(): Record<AgentId, { used: number; limit: number; percentUsed: number; queued: number }> {
    const snap: Record<string, { used: number; limit: number; percentUsed: number; queued: number }> = {};
    for (const [id, entry] of this.budgets.entries()) {
      snap[id] = {
        used: entry.used,
        limit: entry.limit,
        percentUsed: Math.round((entry.used / entry.limit) * 100),
        queued: entry.queued,
      };
    }
    return snap as ReturnType<typeof this.getSnapshot>;
  }

  destroy(): void {
    if (this.drainInterval) {
      clearInterval(this.drainInterval);
      this.drainInterval = null;
    }
    // Resolve all pending queued requests as fallbacks
    for (const req of this.queue) {
      clearTimeout(req.timeoutHandle);
      req.resolve(this._fallbackAllocation(req.agentId));
    }
    this.queue = [];
  }

  // ─── Internals ───────────────────────────────────────────────────────────────

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
        // Grant this specific request
        entry.used += req.estimatedTokens;
        entry.queued = Math.max(0, entry.queued - 1);
        clearTimeout(req.timeoutHandle);
        req.resolve({
          granted: true,
          tokensAvailable: entry.limit - entry.used,
          agentId: req.agentId,
          fallback: false,
          message: "Granted from queue after refill",
        });
        // Do NOT push to remaining — this request is resolved
      } else {
        remaining.push(req);
      }
    }

    this.queue = remaining;
  }

  /** Remove a single request by its unique requestId (used by timeout handler). */
  private _removeRequestById(requestId: string): void {
    const idx = this.queue.findIndex((r) => r.requestId === requestId);
    if (idx !== -1) {
      const [removed] = this.queue.splice(idx, 1);
      const entry = this._ensureEntry(removed.agentId);
      entry.queued = Math.max(0, entry.queued - 1);
    }
  }

  private _fallbackAllocation(agentId: AgentId): TokenAllocation {
    return {
      granted: false,
      tokensAvailable: 0,
      agentId,
      fallback: true,
      message: "Token budget exhausted. Falling back to cached response.",
    };
  }
}

// Singleton — shared across the whole server process
export const tokenBudget = new TokenBudgetService();
