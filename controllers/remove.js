import {
  deleteUserByID,
  deleteProfilePhoto,
  deleteGroupPhoto,
  deleteGroupByID,
} from "../prisma_queries/delete.js";
import { findProfileByUserID } from "../prisma_queries/find.js";
import { v2 as cloudinary } from "cloudinary";

export async function removeUserSelf(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests cannot be deleted");
    }
    const file = await deleteUserByID(req.user.id);
    if (!file) {
      return res.sendStatus(200);
    }
    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeProfilePhoto(req, res, next) {
  try {
    const checkGuest = await findProfileByUserID(req.user.id);
    if (checkGuest.type === "guest") {
      return res.status(404).json("Guests Profile Photo cannot be deleted");
    }
    const file = await deleteProfilePhoto(
      Number(req.params.fileID),
      req.user.profileID,
    );
    if (!file) {
      return res.status(404).json("File not found");
    }
    if (file === "wrong user") {
      return res.status(404).json("You are not authorized to delete this file");
    }

    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeGroupPhoto(req, res, next) {
  try {
    const file = await deleteGroupPhoto(
      Number(req.params.fileID),
      req.user.profileID,
    );
    if (!file) {
      return res.status(404).json("File not found");
    }
    if (file === "Not Admin") {
      return res.status(404).json("You are not authorized to delete this file");
    }

    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeGroup(req, res, next) {
  try {
    const file = await deleteGroupByID(
      Number(req.params.groupID),
      req.user.profileID,
    );
    if (!file) {
      return res.status(200).json("Done");
    }
    if (file === "Not Admin") {
      return res
        .status(404)
        .json("You are not authorized to delete this Group");
    }
    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
