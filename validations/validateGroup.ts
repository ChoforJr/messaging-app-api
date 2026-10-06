import { body } from "express-validator";

export const validateGroupName = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 64 })
    .withMessage("content: Has to have a length of between 1 and 64"),
];

export const validateGroupDescription = [
  body("description")
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage("content: Has to have a length of between 1 and 250"),
];

export const validateGroupAdmin = [
  body("newAdminID")
    .trim()
    .notEmpty()
    .withMessage("newAdminID is required")
    .isInt()
    .withMessage("newAdminID has to be an interger"),
];
