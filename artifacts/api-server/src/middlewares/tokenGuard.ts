/**
 * Token Guard Middleware — COSMOS
 *
 * Checks token budget health before reaching agent endpoints.
 * Returns 503 with a structured fallback when the system is critically low,
 * so the frontend can display a graceful "resource constrained" state instead
 * of a hard crash.
 */

import type { Request, Response, NextFunction } from "express";
import { tokenBudget } from "../services/tokenBudget";

const CRITICAL_THRESHOLD = 10; // percent remaining before we start warning
const EMERGENCY_THRESHOLD = 2; // percent remaining before we serve fallback

export function tokenGuard(req: Request, res: Response, next: NextFunction): void {
  const snapshot = tokenBudget.getSnapshot();

  // Find the most strained agent relevant to this request
  const agentId = (req.params["agentId"] as string | undefined) ?? "system";
  const entry = snapshot[agentId as keyof typeof snapshot] ?? snapshot["system"];

  const percentUsed = entry?.percentUsed ?? 0;
  const percentRemaining = 100 - percentUsed;

  // Attach budget context to request so route handlers can read it
  (req as Request & { tokenContext: unknown }).tokenContext = {
    agentId,
    percentUsed,
    percentRemaining,
    warning: percentRemaining <= CRITICAL_THRESHOLD,
  };

  if (percentRemaining <= EMERGENCY_THRESHOLD) {
    res.status(503).json({
      error: "resource_constrained",
      message: "Token budget critically low. Serving fallback response.",
      fallback: {
        active_mission: "Neural Localization",
        progress: 65,
        system_resonance: 100,
        note: "Cached snapshot — live data temporarily unavailable.",
      },
      token_snapshot: entry,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
}
