/**
 * Agent Router — COSMOS
 *
 * Handles communication between the frontend and AI agents.
 * Static routes (/agents/token-budget) are declared BEFORE parameterized
 * routes (/agents/:agentId/*) to avoid Express matching them as params.
 */

import { Router } from "express";
import { tokenGuard } from "../middleware/tokenGuard.js";
import { requireAuth } from "../middleware/auth.js";
import { neuralGrid } from "../services/neuralGrid.js";
import { tokenBudget, type AgentId } from "../services/tokenBudget.js";
import { logger } from "../lib/logger.js";

const router = Router();

const VALID_AGENTS: AgentId[] = ["robin_vanguard", "starlight", "system"];

// GET /api/agents — list all agents
router.get("/agents", (_req, res) => {
  res.json({ agents: neuralGrid.listAgents(), timestamp: new Date().toISOString() });
});

// GET /api/agents/token-budget — MUST be before /:agentId routes
router.get("/agents/token-budget", (_req, res) => {
  res.json({ budget: tokenBudget.getSnapshot(), timestamp: new Date().toISOString() });
});

// GET /api/agents/:agentId/status
router.get("/agents/:agentId/status", tokenGuard, (req, res) => {
  const { agentId } = req.params;
  if (!VALID_AGENTS.includes(agentId as AgentId)) {
    res.status(404).json({ error: "agent_not_found", agentId });
    return;
  }
  const agent = neuralGrid.getAgent(agentId as AgentId);
  if (!agent) { res.status(404).json({ error: "agent_not_found", agentId }); return; }
  res.json({ agent, timestamp: new Date().toISOString() });
});

// POST /api/agents/:agentId/dispatch — auth required to prevent open LLM abuse
router.post("/agents/:agentId/dispatch", requireAuth, tokenGuard, async (req, res) => {
  const { agentId } = req.params;
  const { task } = req.body as { task?: string };

  if (!VALID_AGENTS.includes(agentId as AgentId)) {
    res.status(404).json({ error: "agent_not_found", agentId });
    return;
  }
  if (!task || typeof task !== "string" || task.trim().length === 0) {
    res.status(400).json({ error: "validation_error", message: "Field 'task' is required." });
    return;
  }

  try {
    const result = await neuralGrid.dispatch(agentId as AgentId, task.trim());
    res.status(result.success ? 200 : 207).json(result);
  } catch (err) {
    logger.error({ err, agentId, task }, "Agent dispatch error");
    res.status(500).json({
      error: "dispatch_error",
      message: "An unexpected error occurred during agent dispatch.",
      fallback: {
        active_mission: "Neural Localization",
        progress: 65,
        system_resonance: 100,
        note: "Cached snapshot — dispatch temporarily unavailable.",
      },
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
