import { Router, type IRouter } from "express";
import healthRouter from "./health";
import agentsRouter from "./agents";
import missionsRouter from "./missions";
import cosmosRouter from "./cosmos";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cosmosRouter);
router.use(missionsRouter);
router.use(agentsRouter);

export default router;
