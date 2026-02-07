import { body } from "express-validator";
import { findGroupByID, findProfileByUserID } from "../prisma_queries/find.js";

export const validateText = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("content: Has to have a length of between 1 and 500"),
];

export const validateUserID = [
  body("toUserID")
    .trim()
    .notEmpty()
    .withMessage("Receipent ID is required")
    .isInt()
    .withMessage("Receipent ID has to be an interger")
    .custom(async (value) => {
      const user = await findProfileByUserID(Number(value));
      if (!user) {
        return true;
      }
      throw new Error("User doesn't exist");
    }),
];

export const validateGroupID = [
  body("toGroupID")
    .trim()
    .notEmpty()
    .withMessage("Group ID is required")
    .isInt()
    .withMessage("Group ID has to be an interger")
    .custom(async (value) => {
      const group = await findGroupByID(Number(value));
      if (!group) {
        return true;
      }
      throw new Error("Group doesn't exist");
    }),
];
