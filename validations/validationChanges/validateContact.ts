import { body } from "express-validator";
import { findProfileByUserID } from "../../prisma_queries/find.js";

export const validateContactIDRules = [
  body("contactId")
    .trim()
    .isInt()
    .withMessage("contactId: Should be an interger")
    .custom(async (value) => {
      const profile = await findProfileByUserID(Number(value));
      if (profile) {
        return true;
      }
      throw new Error("contactId: was not found");
    }),
];
