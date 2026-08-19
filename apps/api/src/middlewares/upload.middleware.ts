import multer from "multer";
import { env } from "../config/env";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxFileSize, files: env.maxFiles },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      const err: unknown = Object.assign(new Error("INVALID_FILE_TYPE"), {
        status: 400,
        code: "INVALID_FILE_TYPE",
      });
      cb(err as Error);
      return;
    }
    cb(null, true);
  },
});
