import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Configure Cloudinary storage for Multer
const storageParams = {
  asset_folder: "messaging-app",
  allowed_formats: ["jpg", "png", "jpeg"],
};

export const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: storageParams,
});
