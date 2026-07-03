/**
 * Mission Router — COSMOS
 *
 * Endpoints for mission state management.
 * The Captain Dashboard polls these to render the live mission panel.
 *
 * All responses conform exactly to the OpenAPI MissionSnapshot schema:
 * { active_mission, progress, system_resonance, mission_id, status,
 *   active_dimension, assigned_agents, started_at, updated_at, timestamp }
 */

import { Router } from "express";
import { neuralGrid } from "../services/neuralGrid";
import type { Mission, MissionStatus } from "../services/neuralGrid";

const router = Router();

/** Map internal Mission model → MissionSnapshot (snake_case API contract). */
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

// ─── GET /api/missions/active ─────────────────────────────────────────────────
// Returns the active mission — this is the primary Captain Dashboard feed.
// Response exactly matches the dashboard contract:
//   { active_mission, progress, system_resonance, ... }
router.get("/missions/active", (_req, res) => {
  res.json(toSnapshot(neuralGrid.getActiveMission()));
});

// ─── GET /api/missions/grid-status ───────────────────────────────────────────
// Full Neural Grid status — mission (MissionSnapshot shape) + agents + tokens.
router.get("/missions/grid-status", (_req, res) => {
  const grid = neuralGrid.getStatus();
  res.json({
    online: grid.online,
    // activeMission returned in snake_case MissionSnapshot shape (matches OpenAPI)
    activeMission: grid.activeMission ? toSnapshot(grid.activeMission) : null,
    agents: grid.agents,
    tokenSnapshot: grid.tokenSnapshot,
    timestamp: grid.timestamp,
  });
});

// ─── PATCH /api/missions/active ───────────────────────────────────────────────
// Update mission progress / status (call from agent webhook or internal tick).
// Body: { "progress": 75, "status": "active", "system_resonance": 98 }
// Response: full MissionSnapshot (matches OpenAPI spec)
router.patch("/missions/active", (req, res) => {
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

  const updated = neuralGrid.updateMission(patch);
  // Return full MissionSnapshot — matches OpenAPI contract
  res.json(toSnapshot(updated));
});

export default router;
