import { validationResult } from "express-validator";
import type { RequestHandler } from "express";

export const checkValidationResult: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
