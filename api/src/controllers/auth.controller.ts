import type { Request, Response } from "express";
import { env } from "../config/env";
import { authService } from "../services/auth.service";
import { asyncHandler, noContent, success } from "../utils/helpers";

function setTokenCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.register(req.body);
    setTokenCookie(res, token);
    success(res, { user }, 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, token } = await authService.login(req.body);
    setTokenCookie(res, token);
    success(res, { user });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", path: "/" });
    noContent(res);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    success(res, { user });
  }),
};
