/**
 * Mission Router — COSMOS
 *
 * All responses conform to the MissionSnapshot contract (snake_case).
 * The Captain Dashboard polls GET /api/missions/active every few seconds.
 */

import { Router } from "express";
import { neuralGrid, type Mission, type MissionStatus } from "../services/neuralGrid.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/** Map internal Mission → snake_case API contract */
function toSnapshot(mission: Mission) {
  return {
    active_mission: mission.name,
    progress: mission.progress,
    system_resonance: mission.systemResonance,
    mission_id: mission.id,
    status: mission.status,
    active_dimension: mission.activeDimension,
    assigned_agents: mission.assignedAgents,
    started_at: mission.startedAt,
    updated_at: mission.updatedAt,
    timestamp: new Date().toISOString(),
  };
}

// GET /api/missions/active — Captain Dashboard primary feed
router.get("/missions/active", (_req, res) => {
  res.json(toSnapshot(neuralGrid.getActiveMission()));
});

// GET /api/missions/grid-status — full Neural Grid state
router.get("/missions/grid-status", (_req, res) => {
  const grid = neuralGrid.getStatus();
  res.json({
    online: grid.online,
    activeMission: grid.activeMission ? toSnapshot(grid.activeMission) : null,
    agents: grid.agents,
    tokenSnapshot: grid.tokenSnapshot,
    timestamp: grid.timestamp,
  });
});

// PATCH /api/missions/active — update progress / status (auth required)
router.patch("/missions/active", requireAuth, (req, res) => {
  const { progress, status, system_resonance } = req.body as {
    progress?: number;
    status?: MissionStatus;
    system_resonance?: number;
  };

  const patch: Parameters<typeof neuralGrid.updateMission>[0] = {};

  if (progress !== undefined) {
    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      res.status(400).json({ error: "validation_error", message: "progress must be 0–100." });
      return;
    }
    patch.progress = progress;
  }

  if (status !== undefined) {
    const valid: MissionStatus[] = ["idle", "active", "paused", "completed", "error"];
    if (!valid.includes(status)) {
      res.status(400).json({ error: "validation_error", message: `status must be one of: ${valid.join(", ")}` });
      return;
    }
    patch.status = status;
  }

  if (system_resonance !== undefined) {
    if (typeof system_resonance !== "number" || system_resonance < 0 || system_resonance > 100) {
      res.status(400).json({ error: "validation_error", message: "system_resonance must be 0–100." });
      return;
    }
    patch.systemResonance = system_resonance;
  }

  res.json(toSnapshot(neuralGrid.updateMission(patch)));
});

export default router;
