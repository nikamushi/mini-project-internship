import type { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };

export function success(res: Response, data: unknown, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function listResponse(res: Response, data: unknown[], meta: unknown): void {
  res.json({ success: true, data, meta });
}

export function noContent(res: Response): void {
  res.status(204).send();
}

export function paginationMeta(
  page: number,
  limit: number,
  total: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return { page: Math.min(page, totalPages), limit, total, totalPages };
}

export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}
