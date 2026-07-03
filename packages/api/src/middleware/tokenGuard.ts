/**
 * Token Guard Middleware — COSMOS API
 *
 * Protects agent endpoints by refusing to forward requests when the relevant
 * agent's token budget is critically low.  Returns a 503 with a structured
 * fallback payload instead of letting the LLM call fail mid-stream.
 *
 * Configuration (env vars):
 *   TOKEN_GUARD_THRESHOLD_PCT — percentage-remaining below which requests are
 *                               blocked. Default: 5 (i.e. ≤ 5 % remaining).
 *
 * The fallback payload always includes:
 *   • The live mission snapshot so the dashboard can still render.
 *   • The exact token_snapshot entry so the frontend can show budget state.
 *   • A machine-readable fallback_reason string.
 */

import type { Request, Response, NextFunction } from "express";
import { tokenBudget } from "../services/tokenBudget.js";
import { neuralGrid } from "../services/neuralGrid.js";

// Read threshold from env; fall back to 5 %.
function readThreshold(): number {
  const v = parseInt(process.env["TOKEN_GUARD_THRESHOLD_PCT"] ?? "", 10);
  return Number.isFinite(v) && v >= 0 && v <= 100 ? v : 5;
}

export function tokenGuard(req: Request, res: Response, next: NextFunction): void {
  const EMERGENCY_THRESHOLD_PCT = readThreshold();

  const snapshot   = tokenBudget.getSnapshot();
  const agentId    = (req.params["agentId"] as string | undefined) ?? "system";
  const entry      = snapshot[agentId as keyof typeof snapshot] ?? snapshot["system"]!;
  const pctRemaining = 100 - (entry?.percentUsed ?? 0);

  if (pctRemaining <= EMERGENCY_THRESHOLD_PCT) {
    // Build a live fallback payload from the current mission state.
    const mission = neuralGrid.getActiveMission();

    res.status(503).json({
      error:          "resource_constrained",
      fallback_reason:"Token budget critical: switching to cached localized backup context",
      // ── Captain Dashboard canonical contract ─────────────────────────────
      fallback: {
        active_mission:   mission.name,
        progress:         mission.progress,
        system_resonance: mission.systemResonance,
        status:           mission.status,
        note:             "Cached snapshot — live agent processing temporarily unavailable.",
      },
      // ── Budget diagnostics ───────────────────────────────────────────────
      token_snapshot: {
        agentId,
        used:            entry?.used ?? 0,
        limit:           entry?.limit ?? 0,
        percent_used:    entry?.percentUsed ?? 0,
        percent_remaining: pctRemaining,
        queued:          entry?.queued ?? 0,
        threshold_pct:   EMERGENCY_THRESHOLD_PCT,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}
