import { Router } from "express";
import { healthRouter } from "../modules/health/index.js";
import { itemsRouter } from "../modules/items/index.js";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/articles", itemsRouter);

export { apiRouter, healthRouter, itemsRouter };
export default apiRouter;
