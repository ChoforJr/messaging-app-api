import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { createUser, insertFiles } from "../prisma_queries/create.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

export async function addNewUser(req, res, next) {
  try {
    const { username, password, displayName } = matchedData(req);
    const hashedPassword = await hash(password, 10);
    const usernameLowerCase = username.toLowerCase();
    await createUser(usernameLowerCase, hashedPassword, displayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function addProfilePhoto(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new Error("File upload failed, no files object found."));
    }
    const data = [];
    req.files.forEach((file) => {
      data.push({
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: file.path,
        ProfileId: Number(req.user.id),
      });
    });
    await insertFiles(data);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
