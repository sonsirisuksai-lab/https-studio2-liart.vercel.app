import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Set CORS_ORIGIN env var to restrict to your Vercel frontend domain in
// production, e.g. CORS_ORIGIN=https://your-app.vercel.app
// Leaving it unset allows all origins (fine for development).
const corsOrigin = process.env["CORS_ORIGIN"];
app.use(
  cors(
    corsOrigin
      ? {
          origin: corsOrigin,
          methods: ["GET", "POST", "PATCH", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        }
      : undefined,
  ),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
