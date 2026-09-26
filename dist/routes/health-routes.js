import { Router } from "express";
import { getHealth } from "../controllers/index.js";
const healthRouter = Router();
healthRouter.get("/", getHealth);
export { healthRouter };
export default healthRouter;
