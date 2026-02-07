import { Router } from "express";
import multer from "multer";
import { addProfilePhoto, addGroupPhoto } from "../controllers/add.js";
import { removeProfilePhoto, removeGroupPhoto } from "../controllers/remove.js";
import { cloudStorage } from "../config/cloudinary.js";

const allowedMimeTypes = ["image/jpeg", "image/png"];
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG and PNG are allowed."), false);
  }
};

const limits = {
  fileSize: 1024 * 1024, // 1 MB limit
};

const uploads = multer({
  storage: cloudStorage,
  fileFilter: fileFilter,
  limits: limits,
});

const fileRouter = Router();

fileRouter.post("/profile/photo", uploads.array("uploads", 1), addProfilePhoto);
fileRouter.delete("/profile/photo/:fileID", removeProfilePhoto);

fileRouter.post(
  "/group/photo/:groupId",
  uploads.array("uploads", 1),
  addGroupPhoto,
);
fileRouter.delete("/group/photo/:fileID", removeGroupPhoto);

fileRouter.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "A file is too large. Max size is 1MB." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ error: "Too many files" });
    }
  }

  if (err.message === "Invalid file type. Only JPG and PNG are allowed.") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Something went wrong on the server." });
});

export default fileRouter;
