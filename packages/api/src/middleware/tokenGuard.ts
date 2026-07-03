import type { Request, Response, NextFunction } from "express";
import { tokenBudget } from "../services/tokenBudget.js";

const EMERGENCY_THRESHOLD = 2; // percent remaining before serving cached fallback

export function tokenGuard(req: Request, res: Response, next: NextFunction): void {
  const snapshot = tokenBudget.getSnapshot();
  const agentId = (req.params["agentId"] as string | undefined) ?? "system";
  const entry = snapshot[agentId as keyof typeof snapshot] ?? snapshot["system"]!;
  const percentRemaining = 100 - (entry?.percentUsed ?? 0);

  if (percentRemaining <= EMERGENCY_THRESHOLD) {
    res.status(503).json({
      error: "resource_constrained",
      message: "Token budget critically low. Serving cached fallback.",
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
