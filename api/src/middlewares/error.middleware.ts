import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(ApiError.notFound(`Endpoint ${req.method} ${req.path} tidak ditemukan.`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {};
    for (const issue of err.issues) {
      details[issue.path.join(".")] = issue.message;
    }
    res.status(422).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Data yang dikirim tidak valid.", details },
    });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        error: { code: "FILE_TOO_LARGE", message: "Ukuran file melebihi batas maksimum." },
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: { code: "FILE_UPLOAD_ERROR", message: `Gagal mengunggah file: ${err.code}` },
    });
    return;
  }

  if (err instanceof Error && (err as { code?: string }).code === "INVALID_FILE_TYPE") {
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_FILE_TYPE",
        message: "Tipe file tidak diizinkan. Gunakan JPEG, PNG, atau WebP.",
      },
    });
    return;
  }

  if (err instanceof Error && (err as { code?: string }).code === "P2002") {
    res.status(409).json({
      success: false,
      error: { code: "CONFLICT", message: "Data sudah ada." },
    });
    return;
  }

  if (err instanceof Error && (err as { code?: string }).code === "P2025") {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Data tidak ditemukan." },
    });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      success: false,
      error: { code: "BAD_REQUEST", message: "Format JSON tidak valid." },
    });
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan internal server." },
  });
};
