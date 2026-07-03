import { Router } from "express";
import healthRouter from "./health.js";
import cosmosRouter from "./cosmos.js";
import missionsRouter from "./missions.js";
import agentsRouter from "./agents.js";

const router = Router();

router.use(healthRouter);
router.use(cosmosRouter);
router.use(missionsRouter);
router.use(agentsRouter);

export default router;
