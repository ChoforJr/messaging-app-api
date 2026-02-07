import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
import { findGroupByID } from "../prisma_queries/find.js";
import {
  createUser,
  insertFiles,
  createTextOnlyMessage,
  createGroup,
} from "../prisma_queries/create.js";
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

export async function addTextOnlyMessage(req, res, next) {
  try {
    const { content, toUserID, toGroupID } = matchedData(req);
    let userRecepient = null;
    let groupRecepient = null;
    if (toUserID !== undefined) {
      userRecepient = Number(toUserID);
    }
    if (toGroupID !== undefined) {
      groupRecepient = Number(toGroupID);
    }
    const message = await createTextOnlyMessage(
      req.user.id,
      content,
      userRecepient,
      groupRecepient,
    );
    res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
}

export async function addGroup(req, res, next) {
  try {
    const { name, description } = matchedData(req);

    const newGroup = await createGroup(req.user.id, name, description);
    res.status(200).json(newGroup);
  } catch (err) {
    return next(err);
  }
}

export async function addGroupPhoto(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(404).json("File upload failed, no files object found.");
    }
    const group = await findGroupByID(Number(req.params.groupId));
    if (!group) {
      return res.status(404).json("Group Not found.");
    }
    if (group.adminId !== req.user.id) {
      return res.status(404).json("You are not authorized to do this.");
    }
    const data = [];
    req.files.forEach((file) => {
      data.push({
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        url: file.path,
        groupId: Number(req.params.groupId),
      });
    });
    await insertFiles(data);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
