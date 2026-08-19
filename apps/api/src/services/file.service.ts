import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";

export interface StoredFile {
  url: string;
  absolutePath: string;
}

const extensionByMime: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function hasMagicBytes(buffer: Buffer, mime: string): boolean {
  if (mime === "image/jpeg") {
    return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mime === "image/png") {
    return (
      buffer.length > 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }
  if (mime === "image/webp") {
    return (
      buffer.length > 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }
  return false;
}

export const fileService = {
  async save(file: Express.Multer.File): Promise<StoredFile> {
    if (file.size > env.maxFileSize) {
      throw ApiError.badRequest("Ukuran file melebihi batas maksimum.", { code: "FILE_TOO_LARGE" });
    }
    const mime = file.mimetype;
    if (!extensionByMime[mime]) {
      throw new ApiError(
        400,
        "INVALID_FILE_TYPE",
        "Tipe file tidak diizinkan. Gunakan JPEG, PNG, atau WebP."
      );
    }
    if (!hasMagicBytes(file.buffer, mime)) {
      throw new ApiError(
        400,
        "INVALID_FILE_TYPE",
        "Isi file tidak sesuai dengan tipe yang dikirim."
      );
    }

    const dir = path.join(env.uploadDir, "reports");
    await mkdir(dir, { recursive: true });
    const filename = `${Date.now()}-${randomUUID()}.${extensionByMime[mime]}`;
    const absolutePath = path.join(dir, filename);
    await writeFile(absolutePath, file.buffer);
    return { url: `/uploads/reports/${filename}`, absolutePath };
  },

  async delete(absolutePath: string): Promise<void> {
    try {
      await unlink(absolutePath);
    } catch {
      // file sudah tidak ada; abaikan
    }
  },

  async cleanup(files: StoredFile[]): Promise<void> {
    await Promise.all(files.map((f) => this.delete(f.absolutePath)));
  },

  async deleteFromUrl(url: string): Promise<void> {
    if (!url.startsWith("/uploads/")) return;
    await this.delete(path.join(env.uploadDir, url.replace("/uploads/", "")));
  },
};
