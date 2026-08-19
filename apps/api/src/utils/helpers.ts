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
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}
