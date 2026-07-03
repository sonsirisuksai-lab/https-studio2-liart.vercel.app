/**
 * COSMOS Root Router
 *
 * Top-level status endpoint — a single call for the Captain Dashboard to
 * know everything is online and receive the canonical mission snapshot.
 */

import { Router } from "express";
import { neuralGrid } from "../services/neuralGrid";
import { tokenBudget } from "../services/tokenBudget";

const router = Router();

// ─── GET /api/cosmos/status ───────────────────────────────────────────────────
// Single endpoint that powers the Captain Dashboard header.
// Exact shape used by the frontend: { active_mission, progress, system_resonance }
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
      version: "0.1.0",
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
        ])
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
