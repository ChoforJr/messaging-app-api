import { readAllGroup, readAllMemberGroup } from "../controllers/read.js";
import {
  editGroupName,
  editGroupDescription,
  editGroupAdmin,
  editGroupJoin,
  editGroupLeave,
  editGroupMembersByAdmin,
} from "../controllers/edit.js";
import {
  validateGroupName,
  validateGroupDescription,
  validateGroupAdmin,
} from "../validations/validateGroup.js";
import { removeGroup } from "../controllers/remove.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { addGroup } from "../controllers/add.js";
import fileRouter from "./fileRouter.js";
import { Router } from "express";

const groupRouter = Router();

groupRouter.get("/all", readAllGroup);
groupRouter.get("/memberOf", readAllMemberGroup);

groupRouter.post(
  "/create",
  validateGroupName,
  validateGroupDescription,
  checkValidationResult,
  addGroup,
);

groupRouter.patch("/join/:groupId", editGroupJoin);
groupRouter.patch("/leave/:groupId", editGroupLeave);
groupRouter.patch(
  "/admin/remove/member/:groupID/:userID",
  editGroupMembersByAdmin,
);

groupRouter.patch(
  "/name/:groupId",
  validateGroupName,
  checkValidationResult,
  editGroupName,
);
groupRouter.patch(
  "/description/:groupId",
  validateGroupDescription,
  checkValidationResult,
  editGroupDescription,
);
groupRouter.patch(
  "/newAdmin/:groupId",
  validateGroupAdmin,
  checkValidationResult,
  editGroupAdmin,
);

groupRouter.delete("/delete/:groupID", removeGroup);

groupRouter.use("/file", fileRouter);

export default groupRouter;
