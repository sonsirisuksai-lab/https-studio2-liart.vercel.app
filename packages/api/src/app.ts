import express, { type Express } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Set CORS_ORIGIN to your Vercel domain in production.
// Supports comma-separated list: "https://a.vercel.app,https://custom.domain.com"
const corsOriginEnv = process.env["CORS_ORIGIN"];
const corsOrigins = corsOriginEnv
  ? corsOriginEnv.split(",").map((o) => o.trim())
  : "*";

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Global: 200 req/15min per IP. Dispatch endpoint gets its own tighter limit.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Too many requests. Please slow down." },
});

const dispatchLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 min window
  max: 20,                 // 20 dispatch calls/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "rate_limited", message: "Dispatch rate limit reached. Wait 60 seconds." },
});

app.use(globalLimiter);
app.use("/api/agents/:agentId/dispatch", dispatchLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Request logging (dev only) ────────────────────────────────────────────────
if (process.env["NODE_ENV"] !== "production") {
  app.use((req, _res, next) => {
    logger.info({ method: req.method, url: req.url?.split("?")[0] }, "→ request");
    next();
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "not_found", message: "Route not found." });
});

export default app;
