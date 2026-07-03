/**
 * COSMOS Status Router
 *
 * GET /api/cosmos/status — primary Captain Dashboard feed.
 * Returns the exact contract the frontend expects:
 *   { active_mission, progress, system_resonance }
 * plus extended COSMOS context for the health panel.
 */

import { Router } from "express";
import { neuralGrid } from "../services/neuralGrid.js";
import { tokenBudget } from "../services/tokenBudget.js";

const router = Router();

router.get("/cosmos/status", (_req, res) => {
  const mission = neuralGrid.getActiveMission();
  const agents = neuralGrid.listAgents();
  const budget = tokenBudget.getSnapshot();

  const onlineAgents = agents.filter((a) => a.status !== "offline").length;

  res.json({
    // ── Captain Dashboard canonical contract ──────────────────────────────
    active_mission: mission.name,
    progress: mission.progress,
    system_resonance: mission.systemResonance,
    // ── Extended COSMOS context ───────────────────────────────────────────
    cosmos: {
      version: "5.0.0",
      dimension: mission.activeDimension,
      mission_status: mission.status,
      agents_online: onlineAgents,
      agents_total: agents.length,
      token_health: Object.fromEntries(
        Object.entries(budget).map(([id, b]) => [
          id,
          {
            percent_remaining: 100 - b.percentUsed,
            status: b.percentUsed > 90 ? "critical" : b.percentUsed > 70 ? "warning" : "healthy",
          },
        ]),
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
