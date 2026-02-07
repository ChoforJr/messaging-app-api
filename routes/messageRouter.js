import {} from "../controllers/read.js";
import {
  validateText,
  validateUserID,
  validateGroupID,
} from "../validations/validateMessage.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { addTextOnlyMessage } from "../controllers/add.js";
import fileRouter from "./fileRouter.js";
import { Router } from "express";

const messageRouter = Router();

messageRouter.post(
  "/text/toUser",
  validateText,
  validateUserID,
  checkValidationResult,
  addTextOnlyMessage,
);
messageRouter.post(
  "/text/toGroup",
  validateText,
  validateGroupID,
  checkValidationResult,
  addTextOnlyMessage,
);

messageRouter.use("/file", fileRouter);

export default messageRouter;
