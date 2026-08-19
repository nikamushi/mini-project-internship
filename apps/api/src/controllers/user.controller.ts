import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler, listResponse, parseId, parseBoolean, success } from "../utils/helpers";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    const result = await userService.list({
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      search: search as string | undefined,
      role: role as string | undefined,
      isActive: parseBoolean(isActive as string | undefined),
    });
    listResponse(res, result.users, result.meta);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const user = await userService.get(id);
    success(res, { user });
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const user = await userService.setStatus(req.user!.id, id, Boolean(req.body.isActive));
    success(res, { user });
  }),
};
