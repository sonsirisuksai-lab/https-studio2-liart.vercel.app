/**
 * COSMOS API — Entry Point
 *
 * Bootstraps the HTTP server and attaches the WebSocket hub on the same port
 * so no additional port or proxy rule is needed.
 *
 * Boot sequence:
 *   1. Create http.Server from the Express app.
 *   2. Attach cosmosHub (registers the /api/ws/cosmos upgrade handler).
 *   3. Start listening.
 *   4. Register graceful shutdown handlers (SIGTERM / SIGINT).
 */

import { createServer } from "node:http";
import app from "./app.js";
import { cosmosHub } from "./ws/cosmosHub.js";
import { tokenBudget } from "./services/tokenBudget.js";
import { logger } from "./lib/logger.js";

const PORT = parseInt(process.env["PORT"] ?? "4000", 10);

// ── Create HTTP server from Express app ──────────────────────────────────────
// We need a raw http.Server (not app.listen()) so that the WebSocketServer can
// hook into the 'upgrade' event on the same underlying TCP socket.

const server = createServer(app);

// ── Attach WebSocket hub (before listen) ─────────────────────────────────────
cosmosHub.attach(server);

// ── Start listening ───────────────────────────────────────────────────────────
server.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 COSMOS API  →  port ${PORT}  (${process.env["NODE_ENV"] ?? "development"})`);
  logger.info(`   HTTP  → /api/healthz`);
  logger.info(`   HTTP  → /api/cosmos/status`);
  logger.info(`   HTTP  → /api/cosmos/ws-info`);
  logger.info(`   HTTP  → /api/missions/active`);
  logger.info(`   HTTP  → /api/agents`);
  logger.info(`   WS    → /api/ws/cosmos`);
  logger.info(`   Gemini: ${process.env["GEMINI_API_KEY"] ? "✅ configured" : "⚠️  GEMINI_API_KEY not set — mock mode"}`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────

function shutdown(signal: string): void {
  logger.info({ signal }, "Shutdown signal received — closing connections");

  // Stop accepting new connections.
  server.close(() => {
    logger.info("HTTP server closed");
  });

  // Close all WebSocket connections and clear intervals.
  cosmosHub.destroy();

  // Flush queued token requests with fallback responses and clear intervals.
  tokenBudget.destroy();

  // Give in-flight requests 5 s to drain, then force exit.
  setTimeout(() => {
    logger.warn("Forced shutdown after 5 s drain timeout");
    process.exit(0);
  }, 5_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

export default server;
