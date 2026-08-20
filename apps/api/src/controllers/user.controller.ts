import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler, listResponse, success } from "../utils/helpers";
import { parseLimit, parseOptionalBoolean, parseOptionalString, parsePage } from "../utils/query";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.list({
      page: parsePage(req.query.page),
      limit: parseLimit(req.query.limit),
      search: parseOptionalString(req.query.search),
      role: parseOptionalString(req.query.role),
      isActive: parseOptionalBoolean(req.query.isActive),
    });
    listResponse(res, result.users, result.meta);
  }),

  get: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.get(Number(req.params.id));
    success(res, { user });
  }),

  setStatus: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.setStatus(
      req.user!.id,
      Number(req.params.id),
      Boolean(req.body.isActive)
    );
    success(res, { user });
  }),
};