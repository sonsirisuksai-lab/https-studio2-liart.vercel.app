/**
 * Neural Grid Service — COSMOS Core Logic
 *
 * Integration seam for LLM orchestration.
 * Currently runs mock responses — replace the dispatch() TODO block with
 * your real Gemini / Claude / OpenRouter agent loop when ready.
 *
 * Persistence: mission state is in-memory for now.
 * Production upgrade: swap ACTIVE_MISSION / AGENTS with Supabase reads/writes
 * using the supabaseAdmin client from lib/supabase.ts.
 */

import { tokenBudget, type AgentId } from "./tokenBudget.js";

export type MissionStatus = "idle" | "active" | "paused" | "completed" | "error";
export type AgentStatus = "online" | "standby" | "busy" | "offline";

export interface Mission {
  id: string;
  name: string;
  status: MissionStatus;
  progress: number;
  systemResonance: number;
  activeDimension: string;
  assignedAgents: AgentId[];
  startedAt: string;
  updatedAt: string;
}

export interface AgentProfile {
  id: AgentId;
  displayName: string;
  role: string;
  status: AgentStatus;
  currentTask: string | null;
  completedTasks: number;
  lastActive: string;
}

export interface GridStatus {
  online: boolean;
  activeMission: Mission | null;
  agents: AgentProfile[];
  tokenSnapshot: ReturnType<typeof tokenBudget.getSnapshot>;
  timestamp: string;
}

export interface DispatchResult {
  success: boolean;
  agentId: AgentId;
  task: string;
  response: string;
  tokensUsed: number;
  fallback: boolean;
  timestamp: string;
}

// ─── In-memory state ──────────────────────────────────────────────────────────
// TODO (production): load from Supabase user_data table keyed by realm=cosmos

const AGENTS: Map<AgentId, AgentProfile> = new Map([
  ["robin_vanguard", {
    id: "robin_vanguard",
    displayName: "Robin Vanguard",
    role: "Intelligence & Analysis",
    status: "online",
    currentTask: null,
    completedTasks: 0,
    lastActive: new Date().toISOString(),
  }],
  ["starlight", {
    id: "starlight",
    displayName: "Starlight",
    role: "Dimensional Navigator & Core Anchor",
    status: "online",
    currentTask: "Neural Localization",
    completedTasks: 7,
    lastActive: new Date().toISOString(),
  }],
  ["system", {
    id: "system",
    displayName: "COSMOS System",
    role: "Orchestration & Resource Management",
    status: "online",
    currentTask: null,
    completedTasks: 42,
    lastActive: new Date().toISOString(),
  }],
]);

let ACTIVE_MISSION: Mission = {
  id: "mission-neural-001",
  name: "Neural Localization",
  status: "active",
  progress: 65,
  systemResonance: 100,
  activeDimension: "Starlight",
  assignedAgents: ["robin_vanguard", "starlight"],
  startedAt: new Date(Date.now() - 3_600_000).toISOString(),
  updatedAt: new Date().toISOString(),
};

// ─── Mock responses (replace with real LLM calls in dispatch()) ───────────────

const MOCK_RESPONSES: Record<string, string[]> = {
  robin_vanguard: [
    "Analysis complete. Neural pathways in Starlight dimension are stable. Recommend proceeding with localization phase.",
    "Intelligence gathered: 3 anomalies detected in sector 7. Flagging for Starlight review.",
    "Vanguard scan complete. No hostile interference detected. Mission integrity: nominal.",
  ],
  starlight: [
    "Dimensional anchor locked. Neural Grid resonance holding at 100%. Proceeding with localization.",
    "Starlight core stable. Progress advancing through neural localization sequence.",
    "Dimension shift stabilized. All crew systems synchronized. Resonance optimal.",
  ],
  system: [
    "COSMOS system check: all agents nominal. Token budgets healthy. Mission continuity guaranteed.",
    "Resource allocation optimized. Queue depth: 0. All subsystems green.",
  ],
};

function pickMockResponse(agentId: AgentId): string {
  const pool = MOCK_RESPONSES[agentId] ?? MOCK_RESPONSES["system"]!;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const neuralGrid = {
  getStatus(): GridStatus {
    return {
      online: true,
      activeMission: ACTIVE_MISSION,
      agents: Array.from(AGENTS.values()),
      tokenSnapshot: tokenBudget.getSnapshot(),
      timestamp: new Date().toISOString(),
    };
  },

  getActiveMission(): Mission {
    return ACTIVE_MISSION;
  },

  updateMission(patch: Partial<Pick<Mission, "progress" | "status" | "systemResonance">>): Mission {
    ACTIVE_MISSION = { ...ACTIVE_MISSION, ...patch, updatedAt: new Date().toISOString() };
    return ACTIVE_MISSION;
  },

  getAgent(id: AgentId): AgentProfile | undefined {
    return AGENTS.get(id);
  },

  listAgents(): AgentProfile[] {
    return Array.from(AGENTS.values());
  },

  async dispatch(agentId: AgentId, task: string): Promise<DispatchResult> {
    const agent = AGENTS.get(agentId);
    if (!agent) {
      return { success: false, agentId, task, response: `Unknown agent: ${agentId}`, tokensUsed: 0, fallback: true, timestamp: new Date().toISOString() };
    }

    agent.status = "busy";
    agent.currentTask = task;
    agent.lastActive = new Date().toISOString();

    const allocation = await tokenBudget.allocate(agentId, 500);

    let response: string;
    let tokensUsed = 0;
    let fallback = false;

    if (allocation.granted) {
      // ── TODO: Replace with real LLM call ──────────────────────────────────
      // Gemini example (using @cosmos/core lib):
      //   import { gemini } from "@cosmos/core";
      //   const result = await gemini.generateContent({ prompt: task, model: "gemini-2.0-flash" });
      //   response = result.text;
      //   tokensUsed = result.usageMetadata?.totalTokenCount ?? 500;
      //
      // Claude / OpenRouter example:
      //   const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      //     method: "POST",
      //     headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      //     body: JSON.stringify({ model: "anthropic/claude-3-5-sonnet", messages: [{ role: "user", content: task }] }),
      //   });
      //   const data = await res.json();
      //   response = data.choices[0].message.content;
      //   tokensUsed = data.usage?.total_tokens ?? 500;
      // ──────────────────────────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 120));
      response = pickMockResponse(agentId);
      tokensUsed = 320;
      tokenBudget.release(agentId, 500 - tokensUsed);
    } else {
      response = `[FALLBACK] ${agent.displayName} is resource-constrained. Cached: "${pickMockResponse(agentId)}"`;
      fallback = true;
    }

    agent.status = "online";
    agent.currentTask = null;
    agent.completedTasks += 1;

    if (ACTIVE_MISSION.status === "active" && ACTIVE_MISSION.progress < 100) {
      ACTIVE_MISSION.progress = Math.min(100, ACTIVE_MISSION.progress + 2);
      ACTIVE_MISSION.updatedAt = new Date().toISOString();
    }

    return { success: !fallback, agentId, task, response, tokensUsed, fallback, timestamp: new Date().toISOString() };
  },
};
