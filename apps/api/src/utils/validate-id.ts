import type { RequestHandler } from "express";
import { ApiError } from "./api-error";

export function validateId(paramName = "id"): RequestHandler {
  return (req, _res, next) => {
    const id = Number(req.params[paramName]);
    if (!Number.isInteger(id) || id <= 0) {
      next(ApiError.badRequest("ID tidak valid."));
      return;
    }
    req.params[paramName] = String(id);
    next();
  };
}