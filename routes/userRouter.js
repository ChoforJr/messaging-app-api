import { readUserByID, readProfiles } from "../controllers/read.js";
import {
  editUserName,
  editDisplayName,
  editPassword,
  editBio,
} from "../controllers/edit.js";
import { removeUserSelf } from "../controllers/remove.js";
import {
  validateUsernameRules,
  validatePasswordRules,
  validateDisplayNameRules,
  validateBioRules,
} from "../validations/validationChanges/validateUser.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import fileRouter from "./fileRouter.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get("/self", readUserByID);
userRouter.get("/profile/all", readProfiles);

userRouter.patch(
  "/self/userName",
  validateUsernameRules,
  checkValidationResult,
  editUserName,
);
userRouter.patch(
  "/self/displayName",
  validateDisplayNameRules,
  checkValidationResult,
  editDisplayName,
);
userRouter.patch(
  "/self/password",
  validatePasswordRules,
  checkValidationResult,
  editPassword,
);
userRouter.patch("/self/bio", validateBioRules, checkValidationResult, editBio);

userRouter.delete("/self", removeUserSelf);

userRouter.use("/file", fileRouter);

export default userRouter;
