/**
 * Neural Grid Service — COSMOS Core Logic
 *
 * Owns all in-memory agent/mission state and orchestrates the Gemini 1.5 Flash
 * agent loop with structured tool calling.
 *
 * Architecture:
 *   • gridEvents (EventEmitter) — emits dispatch lifecycle events that
 *     cosmosHub.ts subscribes to.  No import of cosmosHub here, so there is
 *     zero circular dependency.
 *   • tokenBudget — every prompt + completion token is tracked; unused tokens
 *     are released back to the pool after each call.
 *   • Gemini integration — gracefully falls back to mock responses when
 *     GEMINI_API_KEY is not set, so local dev never breaks.
 *
 * Tool catalogue (available to every agent):
 *   read_grid_status    — returns the live Neural Grid snapshot
 *   generate_status_log — writes a structured log entry (returned in the result)
 *   query_mission_data  — reads a specific mission field by name
 *
 * Production upgrade: replace in-memory AGENTS / ACTIVE_MISSION maps with
 * Supabase reads/writes using supabaseAdmin from lib/supabase.ts.
 */

import { EventEmitter } from "node:events";
import {
  GoogleGenerativeAI,
  SchemaType,
  type Part,
  type FunctionDeclaration,
  type Tool,
} from "@google/generative-ai";
import { tokenBudget, type AgentId } from "./tokenBudget.js";
import { logger } from "../lib/logger.js";

// ── Event bus (consumed by cosmosHub — no circular import) ────────────────────

export const gridEvents = new EventEmitter();
gridEvents.setMaxListeners(20);

// ── Domain types ──────────────────────────────────────────────────────────────

export type MissionStatus = "idle" | "active" | "paused" | "completed" | "error";
export type AgentStatus   = "online" | "standby" | "busy" | "offline";

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
  toolCallsExecuted: number;
  timestamp: string;
}

// ── Structured log entries (produced by the generate_status_log tool) ─────────

interface StatusLogEntry {
  level: "info" | "warning" | "critical";
  message: string;
  agentId: AgentId;
  timestamp: string;
}
const missionLog: StatusLogEntry[] = [];

// ── In-memory state ───────────────────────────────────────────────────────────
// TODO (production): load from / persist to Supabase user_data table.

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

// ── Gemini setup ──────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env["GEMINI_API_KEY"] ?? "";
const geminiClient   = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Tokens to pre-allocate before each dispatch.  We release the unused portion
// after the call completes.
const ESTIMATED_DISPATCH_TOKENS = 2_000;

// Hard cap on tool-call iterations per dispatch to prevent run-away loops.
const MAX_AGENT_LOOP_ITERATIONS = 5;

// ── Agent personas (system instructions) ─────────────────────────────────────

const AGENT_PERSONAS: Record<AgentId, string> = {
  robin_vanguard: `You are Robin Vanguard, the Intelligence & Analysis agent of the COSMOS OS crew.
Your role: gather intelligence, detect anomalies, perform deep analysis, and report concisely.
Communication style: precise, data-driven, tactical. Use short declarative sentences.
Current mission: Neural Localization — mapping neural pathways in the Starlight dimension.
Always use the available tools to read live grid data before forming conclusions.`,

  starlight: `You are Starlight, the Dimensional Navigator & Core Anchor of the COSMOS OS crew.
Your role: maintain dimensional stability, anchor the Neural Grid resonance, guide the crew through dimensional shifts.
Communication style: calm, poetic yet precise. Blend technical accuracy with dimensional awareness.
Current mission: Neural Localization — anchoring dimensional resonance at 100%.
Always check grid status and log your anchor adjustments via the status log tool.`,

  system: `You are the COSMOS System Orchestrator, responsible for resource management and crew coordination.
Your role: monitor all subsystems, balance token budgets, ensure mission continuity, and report system health.
Communication style: terse, structured, always includes key metrics.
Use read_grid_status frequently and generate status logs for every significant event.`,
};

// ── Tool definitions ──────────────────────────────────────────────────────────

const COSMOS_TOOLS: Tool[] = [{
  functionDeclarations: [
    {
      name: "read_grid_status",
      description: "Read the current COSMOS Neural Grid status: mission progress, agent statuses, token budgets, and system resonance. Call this first before drawing any conclusions.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {},
        required: [],
      },
    } satisfies FunctionDeclaration,
    {
      name: "generate_status_log",
      description: "Write a structured log entry to the mission journal. Use this to record significant observations, warnings, or critical events.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          level: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["info", "warning", "critical"],
            description: "Severity level of the log entry.",
          },
          message: {
            type: SchemaType.STRING,
            description: "The log message to record. Be specific and include relevant metrics.",
          },
        },
        required: ["level", "message"],
      },
    } satisfies FunctionDeclaration,
    {
      name: "query_mission_data",
      description: "Query a specific field from the active mission record.",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          field: {
            type: SchemaType.STRING,
            format: "enum",
            enum: ["progress", "status", "agents", "resonance", "dimension", "started_at"],
            description: "The mission field to retrieve.",
          },
        },
        required: ["field"],
      },
    } satisfies FunctionDeclaration,
  ],
}];

// ── Tool executor ─────────────────────────────────────────────────────────────

function executeTool(
  name: string,
  args: Record<string, unknown>,
  callingAgent: AgentId,
): unknown {
  switch (name) {
    case "read_grid_status": {
      const snap = tokenBudget.getSnapshot();
      return {
        mission: {
          id:              ACTIVE_MISSION.id,
          name:            ACTIVE_MISSION.name,
          status:          ACTIVE_MISSION.status,
          progress:        ACTIVE_MISSION.progress,
          systemResonance: ACTIVE_MISSION.systemResonance,
          activeDimension: ACTIVE_MISSION.activeDimension,
        },
        agents: Array.from(AGENTS.values()).map((a) => ({
          id:            a.id,
          displayName:   a.displayName,
          status:        a.status,
          currentTask:   a.currentTask,
          completedTasks:a.completedTasks,
        })),
        tokenBudgets: Object.fromEntries(
          Object.entries(snap).map(([id, b]) => [id, {
            percentUsed:      b.percentUsed,
            percentRemaining: 100 - b.percentUsed,
            queued:           b.queued,
          }]),
        ),
        timestamp: new Date().toISOString(),
      };
    }

    case "generate_status_log": {
      const level   = (args["level"] as string | undefined) ?? "info";
      const message = (args["message"] as string | undefined) ?? "";
      const entry: StatusLogEntry = {
        level: level as "info" | "warning" | "critical",
        message,
        agentId: callingAgent,
        timestamp: new Date().toISOString(),
      };
      missionLog.push(entry);
      if (missionLog.length > 200) missionLog.shift(); // rolling window
      logger.info({ entry }, "Mission log entry created");
      return { logged: true, entry };
    }

    case "query_mission_data": {
      const field = args["field"] as string | undefined;
      switch (field) {
        case "progress":    return { field, value: ACTIVE_MISSION.progress };
        case "status":      return { field, value: ACTIVE_MISSION.status };
        case "resonance":   return { field, value: ACTIVE_MISSION.systemResonance };
        case "dimension":   return { field, value: ACTIVE_MISSION.activeDimension };
        case "started_at":  return { field, value: ACTIVE_MISSION.startedAt };
        case "agents":      return { field, value: ACTIVE_MISSION.assignedAgents };
        default:            return { field, error: "Unknown field" };
      }
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── Mock fallback responses ───────────────────────────────────────────────────

const MOCK_RESPONSES: Record<AgentId, string[]> = {
  robin_vanguard: [
    "Analysis complete. Neural pathways in Starlight dimension are stable. No anomalies detected. Recommend proceeding with localization phase — mission integrity: nominal.",
    "Intelligence gathered: 3 minor resonance fluctuations detected in sector 7. Flagging for Starlight's attention. Grid coherence holding at 94%.",
    "Vanguard scan complete. No hostile interference detected. Token budget healthy. Mission continuity guaranteed.",
  ],
  starlight: [
    "Dimensional anchor locked. Neural Grid resonance holding at 100%. Proceeding with localization sequence — all harmonics stable.",
    "Starlight core stable. Progress advancing steadily through neural localization. Dimension shift absorbed — crew systems synchronized.",
    "Resonance optimal. Anchor point secured at dimensional convergence node. Crew, we are clear to proceed.",
  ],
  system: [
    "COSMOS system check: all agents nominal. Token budgets healthy. Mission continuity guaranteed. No queued requests.",
    "Resource allocation optimized. Queue depth: 0. All subsystems green. Neural Grid online.",
  ],
};

function pickMockResponse(agentId: AgentId): string {
  const pool = MOCK_RESPONSES[agentId] ?? MOCK_RESPONSES["system"]!;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

// ── Gemini agent loop ─────────────────────────────────────────────────────────

async function runGeminiLoop(agentId: AgentId, task: string): Promise<{
  response: string;
  tokensUsed: number;
  toolCallsExecuted: number;
}> {
  if (!geminiClient) {
    // No API key — graceful mock fallback.
    logger.warn("GEMINI_API_KEY not set — using mock response");
    await new Promise((r) => setTimeout(r, 80)); // simulate latency
    return { response: pickMockResponse(agentId), tokensUsed: 320, toolCallsExecuted: 0 };
  }

  const model = geminiClient.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: AGENT_PERSONAS[agentId],
    tools: COSMOS_TOOLS,
  });

  const chat = model.startChat({ history: [] });

  let totalTokens = 0;
  let toolCallsExecuted = 0;
  let iteration = 0;

  // ── Turn 1: initial task prompt ────────────────────────────────────────────
  const firstResult = await chat.sendMessage(task);
  totalTokens += firstResult.response.usageMetadata?.totalTokenCount ?? 0;

  // Emit the first thought (even if it's about to call a tool).
  const firstText = firstResult.response.text();
  if (firstText) {
    gridEvents.emit("dispatch:thought", {
      agentId,
      displayName: AGENTS.get(agentId)!.displayName,
      thought: firstText,
      step: iteration,
      totalTokensUsed: totalTokens,
      timestamp: new Date().toISOString(),
    });
  }

  let currentResult = firstResult;

  // ── Tool call loop ─────────────────────────────────────────────────────────
  while (
    (currentResult.response.functionCalls()?.length ?? 0) > 0 &&
    iteration < MAX_AGENT_LOOP_ITERATIONS
  ) {
    iteration++;
    const calls = currentResult.response.functionCalls()!;

    // Build function response parts.
    const responseParts: Part[] = calls.map((call) => {
      toolCallsExecuted++;
      const result = executeTool(call.name, call.args as Record<string, unknown>, agentId);
      logger.info({ agentId, tool: call.name, iteration }, "Tool call executed");
      return {
        functionResponse: {
          name: call.name,
          response: { name: call.name, content: result },
        },
      };
    });

    // Send tool results back to Gemini.
    currentResult = await chat.sendMessage(responseParts);
    totalTokens += currentResult.response.usageMetadata?.totalTokenCount ?? 0;

    // Emit mid-loop thought.
    const loopText = currentResult.response.text();
    if (loopText) {
      gridEvents.emit("dispatch:thought", {
        agentId,
        displayName: AGENTS.get(agentId)!.displayName,
        thought: loopText,
        step: iteration,
        totalTokensUsed: totalTokens,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const finalResponse = currentResult.response.text() || pickMockResponse(agentId);
  return { response: finalResponse, tokensUsed: totalTokens, toolCallsExecuted };
}

// ── Public API ────────────────────────────────────────────────────────────────

export const neuralGrid = {
  getStatus(): GridStatus {
    return {
      online:        true,
      activeMission: ACTIVE_MISSION,
      agents:        Array.from(AGENTS.values()),
      tokenSnapshot: tokenBudget.getSnapshot(),
      timestamp:     new Date().toISOString(),
    };
  },

  getActiveMission(): Mission {
    return ACTIVE_MISSION;
  },

  updateMission(
    patch: Partial<Pick<Mission, "progress" | "status" | "systemResonance">>,
  ): Mission {
    ACTIVE_MISSION = { ...ACTIVE_MISSION, ...patch, updatedAt: new Date().toISOString() };
    return ACTIVE_MISSION;
  },

  getAgent(id: AgentId): AgentProfile | undefined {
    return AGENTS.get(id);
  },

  listAgents(): AgentProfile[] {
    return Array.from(AGENTS.values());
  },

  getMissionLog(): StatusLogEntry[] {
    return [...missionLog];
  },

  async dispatch(agentId: AgentId, task: string): Promise<DispatchResult> {
    const agent = AGENTS.get(agentId);
    if (!agent) {
      return {
        success: false,
        agentId,
        task,
        response: `Unknown agent: ${agentId}`,
        tokensUsed: 0,
        fallback: true,
        toolCallsExecuted: 0,
        timestamp: new Date().toISOString(),
      };
    }

    // ── Set agent busy ───────────────────────────────────────────────────────
    agent.status      = "busy";
    agent.currentTask = task;
    agent.lastActive  = new Date().toISOString();

    // ── Announce dispatch start over WS ─────────────────────────────────────
    gridEvents.emit("dispatch:start", {
      agentId,
      displayName: agent.displayName,
      task,
      timestamp: new Date().toISOString(),
    });

    // ── Pre-allocate token budget ────────────────────────────────────────────
    const allocation = await tokenBudget.allocate(agentId, ESTIMATED_DISPATCH_TOKENS);

    let response:          string;
    let tokensUsed:        number;
    let toolCallsExecuted: number;
    let fallback:          boolean;

    if (!allocation.granted) {
      // ── Budget exhausted — serve cached fallback ─────────────────────────
      response          = `Token budget critical: switching to cached localized backup context. [${agent.displayName}]: ${pickMockResponse(agentId)}`;
      tokensUsed        = 0;
      toolCallsExecuted = 0;
      fallback          = true;
      logger.warn({ agentId, task }, "Token budget exhausted — fallback response served");
    } else {
      // ── Run Gemini agent loop ────────────────────────────────────────────
      try {
        const result = await runGeminiLoop(agentId, task);
        response          = result.response;
        tokensUsed        = result.tokensUsed;
        toolCallsExecuted = result.toolCallsExecuted;
        fallback          = false;

        // Reconcile the pre-allocation with actual usage in both directions:
        //   • actual < estimate → release the unused portion back to the pool.
        //   • actual > estimate → charge the overage so the snapshot stays accurate.
        const delta = tokensUsed - ESTIMATED_DISPATCH_TOKENS;
        if (delta < 0) {
          tokenBudget.release(agentId, -delta);    // under-used: return tokens
        } else if (delta > 0) {
          tokenBudget.charge(agentId, delta);       // over-used: debit the extra
        }

      } catch (err) {
        logger.error({ err, agentId, task }, "Gemini agent loop error — serving fallback");
        response          = `[FALLBACK] ${agent.displayName}: ${pickMockResponse(agentId)}`;
        tokensUsed        = 0;
        toolCallsExecuted = 0;
        fallback          = true;
        // Release the full estimate since we never used it.
        tokenBudget.release(agentId, ESTIMATED_DISPATCH_TOKENS);
      }
    }

    // ── Restore agent state ──────────────────────────────────────────────────
    agent.status         = "online";
    agent.currentTask    = null;
    agent.completedTasks += 1;
    agent.lastActive     = new Date().toISOString();

    // Advance mission progress on every successful dispatch.
    if (!fallback && ACTIVE_MISSION.status === "active" && ACTIVE_MISSION.progress < 100) {
      ACTIVE_MISSION.progress  = Math.min(100, ACTIVE_MISSION.progress + 2);
      ACTIVE_MISSION.updatedAt = new Date().toISOString();
    }

    const dispatchResult: DispatchResult = {
      success: !fallback,
      agentId,
      task,
      response,
      tokensUsed,
      fallback,
      toolCallsExecuted,
      timestamp: new Date().toISOString(),
    };

    // ── Broadcast completion over WS ─────────────────────────────────────────
    gridEvents.emit("dispatch:complete", dispatchResult);

    return dispatchResult;
  },
};
