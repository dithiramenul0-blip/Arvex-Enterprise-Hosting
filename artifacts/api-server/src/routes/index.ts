import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import usersRouter from "./users.js";
import plansRouter from "./plans.js";
import ordersRouter from "./orders.js";
import servicesRouter from "./services.js";
import ticketsRouter from "./tickets.js";
import partnersRouter from "./partners.js";
import contentRouter from "./content.js";
import adminRouter from "./admin.js";
import statsRouter from "./stats.js";
import provisioningRouter from "./provisioning.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/plans", plansRouter);
router.use("/orders", ordersRouter);
router.use("/services", servicesRouter);
router.use("/tickets", ticketsRouter);
router.use("/partners", partnersRouter);
router.use("/content", contentRouter);
router.use("/admin", adminRouter);
router.use("/admin", provisioningRouter);
router.use("/stats", statsRouter);

export default router;
