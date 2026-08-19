import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = readToken(req);
    if (!token) throw ApiError.unauthorized();

    let payload: { sub: string };
    try {
      payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    } catch {
      throw ApiError.unauthorized("Sesi telah berakhir.", "SESSION_EXPIRED");
    }

    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user || !user.isActive) throw ApiError.unauthorized();

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
};

function readToken(req: Parameters<RequestHandler>[0]): string | undefined {
  const cookieToken = req.cookies?.token;
  const headerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  return cookieToken ?? headerToken;
}

/**
 * Menyisipkan user bila token valid, tanpa menolak request anonim.
 * Dipakai pada endpoint publik yang menampilkan data milik user (mis. my reports).
 */
export const optionalAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = readToken(req);
    if (!token) return next();
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (user && user.isActive) {
      req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    }
    next();
  } catch {
    next();
  }
};

export const requireRole =
  (...roles: string[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }
    next();
  };
