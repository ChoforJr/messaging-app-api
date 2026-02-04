import { Router } from "express";
import userRouter from "./userRouter.js";
const indexRouter = Router();

indexRouter.use("/user", userRouter);

export default indexRouter;
