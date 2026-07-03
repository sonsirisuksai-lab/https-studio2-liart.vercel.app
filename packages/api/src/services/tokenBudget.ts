/**
 * Token Budget Tracker — COSMOS Core
 *
 * Tracks per-agent token usage, enforces budget limits, and maintains a
 * request queue so we never hit a hard out-of-tokens failure mid-mission.
 * Limits are read from environment variables so they can be tuned in production.
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

function readLimit(envKey: string, defaultValue: number): number {
  const v = parseInt(process.env[envKey] ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : defaultValue;
}

const DEFAULT_LIMITS: Record<AgentId, number> = {
  robin_vanguard: readLimit("TOKEN_LIMIT_ROBIN", 8_000),
  starlight: readLimit("TOKEN_LIMIT_STARLIGHT", 12_000),
  system: readLimit("TOKEN_LIMIT_SYSTEM", 4_000),
};

const QUEUE_TIMEOUT_MS = 15_000;

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
    this.drainInterval = setInterval(() => this._drainQueue(), 5_000);

    const cleanup = (): void => this.destroy();
    process.once("exit", cleanup);
    process.once("SIGTERM", cleanup);
    process.once("SIGINT", cleanup);
  }

  async allocate(agentId: AgentId, estimatedTokens: number): Promise<TokenAllocation> {
    const entry = this._ensureEntry(agentId);

    if (entry.used + estimatedTokens <= entry.limit) {
      entry.used += estimatedTokens;
      return { granted: true, tokensAvailable: entry.limit - entry.used, agentId, fallback: false };
    }

    return new Promise<TokenAllocation>((resolve) => {
      const requestId = newRequestId();
      const timeoutHandle = setTimeout(() => {
        this._removeRequestById(requestId);
        resolve(this._fallbackAllocation(agentId));
      }, QUEUE_TIMEOUT_MS);
      this.queue.push({ requestId, agentId, estimatedTokens, resolve, timeoutHandle });
      entry.queued += 1;
    });
  }

  release(agentId: AgentId, savedTokens: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - savedTokens);
    this._drainQueue();
  }

  refill(agentId: AgentId, amount?: number): void {
    const entry = this._ensureEntry(agentId);
    entry.used = Math.max(0, entry.used - (amount ?? entry.limit));
    this._drainQueue();
  }

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
    for (const req of this.queue) {
      clearTimeout(req.timeoutHandle);
      req.resolve(this._fallbackAllocation(req.agentId));
    }
    this.queue = [];
  }

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
          message: "Granted from queue after refill",
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

export const tokenBudget = new TokenBudgetService();
