/**
 * COSMOS WebSocket Hub — Real-time Status Feed
 *
 * Attaches a WebSocketServer to the existing HTTP server (no extra port needed).
 * Endpoint: ws(s)://your-host/api/ws/cosmos
 *
 * Protocol (server → client): JSON-serialised CosmosEvent
 * Protocol (client → server): { type: "ping" } → server replies { type: "pong", ts }
 *
 * Lifecycle:
 *   1. index.ts calls cosmosHub.attach(httpServer) after creating the HTTP server.
 *   2. attach() wires upgrade events, subscribes to gridEvents and tokenBudget changes.
 *   3. Every 10 s a full cosmos:status snapshot is broadcast.
 *   4. Every 30 s a WebSocket-level heartbeat (ws ping frame) drops stale clients.
 */

import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage, Server } from "node:http";
import { logger } from "../lib/logger.js";
import { tokenBudget } from "../services/tokenBudget.js";
import { neuralGrid, gridEvents } from "../services/neuralGrid.js";
import { verifySupabaseJwt } from "../lib/supabase.js";

// ── Typed event payloads ───────────────────────────────────────────────────────

export interface CosmosStatusPayload {
  active_mission: string;
  progress: number;
  system_resonance: number;
  agents_online: number;
  dimension: string;
  token_health: Record<string, { percent_remaining: number; status: "healthy" | "warning" | "critical" }>;
  timestamp: string;
}

export interface AgentThoughtPayload {
  agentId: string;
  displayName: string;
  thought: string;
  step: number;
  totalTokensUsed: number;
  timestamp: string;
}

export interface DispatchStartPayload {
  agentId: string;
  displayName: string;
  task: string;
  timestamp: string;
}

export interface DispatchCompletePayload {
  agentId: string;
  task: string;
  response: string;
  tokensUsed: number;
  fallback: boolean;
  success: boolean;
  timestamp: string;
}

export type CosmosEvent =
  | { type: "cosmos:status";       data: CosmosStatusPayload }
  | { type: "agent:thought";       data: AgentThoughtPayload }
  | { type: "agent:dispatch_start";data: DispatchStartPayload }
  | { type: "agent:dispatch_complete"; data: DispatchCompletePayload }
  | { type: "token:update";        data: ReturnType<typeof tokenBudget.getSnapshot> }
  | { type: "pong";                ts: string };

// ── Client record ─────────────────────────────────────────────────────────────

interface ConnectedClient {
  ws: WebSocket;
  id: string;
  connectedAt: string;
  isAlive: boolean;
}

// ── Hub ───────────────────────────────────────────────────────────────────────

class CosmosHubServer {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, ConnectedClient> = new Map();
  private statusInterval: ReturnType<typeof setInterval> | null = null;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  private _counter = 0;
  private _budgetUnsubscribe: (() => void) | null = null;

  // Stored listener refs so we can cleanly remove them in destroy().
  private _onDispatchStart:    ((p: DispatchStartPayload)    => void) | null = null;
  private _onDispatchThought:  ((p: AgentThoughtPayload)     => void) | null = null;
  private _onDispatchComplete: ((p: DispatchCompletePayload) => void) | null = null;

  /**
   * Attach the WebSocket server to an existing http.Server.
   * Must be called once in index.ts, before server.listen().
   *
   * Auth: set WS_AUTH_REQUIRED=true in production to require a valid Supabase
   * JWT in the query string: ws://host/api/ws/cosmos?token=<supabase-access-token>
   * In dev (default) connections are accepted without auth.
   */
  attach(server: Server): void {
    if (this.wss) {
      logger.warn("CosmosHub already attached — skipping duplicate attach()");
      return;
    }

    const authRequired = process.env["WS_AUTH_REQUIRED"] === "true";

    // noServer: we handle the HTTP upgrade ourselves so we can path-filter.
    this.wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", (req: IncomingMessage, socket, head) => {
      const rawUrl = req.url ?? "";
      // Strip query string for path comparison.
      const pathname = rawUrl.split("?")[0];
      if (pathname !== "/api/ws/cosmos") {
        socket.destroy();
        return;
      }
      this.wss!.handleUpgrade(req, socket, head, (ws) => {
        this.wss!.emit("connection", ws, req);
      });
    });

    // Connection handler receives the IncomingMessage as second arg.
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      void this._onConnection(ws, req, authRequired);
    });

    // ── neuralGrid event listeners (stored for cleanup) ─────────────────────
    this._onDispatchStart = (payload) => {
      this.broadcast({ type: "agent:dispatch_start", data: payload });
    };
    this._onDispatchThought = (payload) => {
      this.broadcast({ type: "agent:thought", data: payload });
    };
    this._onDispatchComplete = (payload) => {
      this.broadcast({ type: "agent:dispatch_complete", data: payload });
      // Also push a fresh status snapshot so the dashboard reflects new progress.
      this.broadcast(this._buildStatusEvent());
    };

    gridEvents.on("dispatch:start",    this._onDispatchStart);
    gridEvents.on("dispatch:thought",  this._onDispatchThought);
    gridEvents.on("dispatch:complete", this._onDispatchComplete);

    // ── Token budget change subscription ────────────────────────────────────
    this._budgetUnsubscribe = tokenBudget.onBudgetChange((snap) => {
      this.broadcast({ type: "token:update", data: snap });
    });

    // ── Periodic status broadcast every 10 s ────────────────────────────────
    this.statusInterval = setInterval(() => {
      if (this.clients.size > 0) this.broadcast(this._buildStatusEvent());
    }, 10_000);

    // ── WebSocket-level heartbeat every 30 s ────────────────────────────────
    this.heartbeatInterval = setInterval(() => this._heartbeat(), 30_000);

    logger.info(
      { authRequired },
      "🔌 CosmosHub WebSocket server attached → /api/ws/cosmos",
    );
  }

  /** Broadcast a typed event to every connected client. */
  broadcast(event: CosmosEvent): void {
    if (this.clients.size === 0) return;
    const payload = JSON.stringify(event);
    for (const client of this.clients.values()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload, (err) => {
          if (err) logger.warn({ clientId: client.id, err }, "WS send error");
        });
      }
    }
  }

  /** Number of currently connected clients. */
  get connectionCount(): number {
    return this.clients.size;
  }

  /**
   * Clean shutdown — called from process signal handlers in index.ts.
   * Removes all gridEvents listeners to prevent leaks on in-process restarts.
   */
  destroy(): void {
    if (this.statusInterval)   { clearInterval(this.statusInterval);   this.statusInterval = null; }
    if (this.heartbeatInterval){ clearInterval(this.heartbeatInterval); this.heartbeatInterval = null; }
    if (this._budgetUnsubscribe) { this._budgetUnsubscribe(); this._budgetUnsubscribe = null; }

    // Remove gridEvents listeners by stored ref to prevent accumulation.
    if (this._onDispatchStart)    { gridEvents.off("dispatch:start",    this._onDispatchStart);    this._onDispatchStart    = null; }
    if (this._onDispatchThought)  { gridEvents.off("dispatch:thought",  this._onDispatchThought);  this._onDispatchThought  = null; }
    if (this._onDispatchComplete) { gridEvents.off("dispatch:complete", this._onDispatchComplete); this._onDispatchComplete = null; }

    this.wss?.close();
    this.clients.clear();
    logger.info("CosmosHub destroyed");
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private async _onConnection(
    ws: WebSocket,
    req: IncomingMessage,
    authRequired: boolean,
  ): Promise<void> {
    // ── Optional JWT auth ──────────────────────────────────────────────────
    // Browser WebSocket API cannot send custom headers, so the token is
    // passed as a query-string parameter:
    //   ws://host/api/ws/cosmos?token=<supabase-access-token>
    // Set WS_AUTH_REQUIRED=true in production to enforce this.
    if (authRequired) {
      const rawUrl = req.url ?? "";
      const qs = rawUrl.includes("?") ? rawUrl.slice(rawUrl.indexOf("?") + 1) : "";
      const params = new URLSearchParams(qs);
      const token = params.get("token");
      const user = token ? await verifySupabaseJwt(`Bearer ${token}`) : null;

      if (!user) {
        // Close with application-level 4001 Unauthorized code.
        ws.close(4001, "Unauthorized");
        logger.warn({ url: rawUrl }, "WebSocket connection rejected — invalid or missing token");
        return;
      }
      logger.info({ userId: user.id }, "WebSocket client authenticated");
    }
    // ── End auth ───────────────────────────────────────────────────────────

    const id = `ws-${++this._counter}-${Date.now()}`;
    const client: ConnectedClient = {
      ws,
      id,
      connectedAt: new Date().toISOString(),
      isAlive: true,
    };
    this.clients.set(id, client);
    logger.info({ clientId: id, total: this.clients.size }, "WebSocket client connected");

    // Immediately push a full snapshot on connect so the dashboard doesn't wait 10 s.
    this._sendTo(client, this._buildStatusEvent());
    this._sendTo(client, { type: "token:update", data: tokenBudget.getSnapshot() });

    // Track heartbeat responses.
    ws.on("pong", () => { client.isAlive = true; });

    // Handle client messages.
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString()) as { type?: string };
        if (msg.type === "ping") {
          this._sendTo(client, { type: "pong", ts: new Date().toISOString() });
        }
      } catch {
        // Ignore malformed JSON — don't crash the hub.
      }
    });

    ws.on("close", (code) => {
      this.clients.delete(id);
      logger.info({ clientId: id, code, remaining: this.clients.size }, "WebSocket client disconnected");
    });

    ws.on("error", (err) => {
      logger.warn({ clientId: id, err }, "WebSocket client error");
      this.clients.delete(id);
    });
  }

  private _sendTo(client: ConnectedClient, event: CosmosEvent): void {
    if (client.ws.readyState !== WebSocket.OPEN) return;
    client.ws.send(JSON.stringify(event), (err) => {
      if (err) logger.warn({ clientId: client.id, err }, "WS targeted send error");
    });
  }

  private _buildStatusEvent(): Extract<CosmosEvent, { type: "cosmos:status" }> {
    const mission = neuralGrid.getActiveMission();
    const agents  = neuralGrid.listAgents();
    const budget  = tokenBudget.getSnapshot();

    return {
      type: "cosmos:status",
      data: {
        active_mission:  mission.name,
        progress:        mission.progress,
        system_resonance:mission.systemResonance,
        agents_online:   agents.filter((a) => a.status !== "offline").length,
        dimension:       mission.activeDimension,
        token_health: Object.fromEntries(
          Object.entries(budget).map(([agentId, b]) => [
            agentId,
            {
              percent_remaining: 100 - b.percentUsed,
              status: (
                b.percentUsed > 90 ? "critical" :
                b.percentUsed > 70 ? "warning"  : "healthy"
              ) as "healthy" | "warning" | "critical",
            },
          ]),
        ),
        timestamp: new Date().toISOString(),
      },
    };
  }

  private _heartbeat(): void {
    for (const [id, client] of this.clients.entries()) {
      if (!client.isAlive) {
        client.ws.terminate();
        this.clients.delete(id);
        logger.info({ clientId: id }, "WebSocket client terminated (heartbeat timeout)");
        continue;
      }
      client.isAlive = false;
      client.ws.ping();
    }
  }
}

export const cosmosHub = new CosmosHubServer();
