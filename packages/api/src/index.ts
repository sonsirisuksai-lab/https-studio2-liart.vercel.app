import app from "./app.js";
import { logger } from "./lib/logger.js";

const PORT = parseInt(process.env["PORT"] ?? "4000", 10);

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 COSMOS API running on port ${PORT} (${process.env["NODE_ENV"] ?? "development"})`);
  logger.info(`   → Health:  http://localhost:${PORT}/api/healthz`);
  logger.info(`   → Status:  http://localhost:${PORT}/api/cosmos/status`);
  logger.info(`   → Mission: http://localhost:${PORT}/api/missions/active`);
  logger.info(`   → Agents:  http://localhost:${PORT}/api/agents`);
});

export default app;
