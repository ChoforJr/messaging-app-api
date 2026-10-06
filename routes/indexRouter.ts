import { Router } from "express";
import userRouter from "./userRouter.js";
import messageRouter from "./messageRouter.js";
import groupRouter from "./groupRouter.js";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/message", messageRouter);
indexRouter.use("/group", groupRouter);

export default indexRouter;
