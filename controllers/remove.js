import {
  deleteUserByID,
  deleteProfilePhoto,
} from "../prisma_queries/delete.js";
import { v2 as cloudinary } from "cloudinary";

export async function removeUserSelf(req, res, next) {
  try {
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
    const file = await deleteProfilePhoto(
      Number(req.params.fileID),
      req.user.id,
    );
    if (file === "wrong user") {
      return res.status(404).json("You are not authorized to delete this file");
    }
    if (!file) {
      return res.status(404).json("File not found");
    }
    await cloudinary.uploader.destroy(file.fileName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
