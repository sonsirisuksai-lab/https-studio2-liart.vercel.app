import { Router } from "express";

const router = Router();

router.get("/healthz", (_req, res) => {
  res.json({ status: "ok", service: "@cosmos/api", timestamp: new Date().toISOString() });
});

export default router;
