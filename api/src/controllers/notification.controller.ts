import type { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler, listResponse, noContent, parseId, success } from "../utils/helpers";

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, unread } = req.query;
    const result = await notificationService.list(
      req.user!.id,
      Number(page),
      Math.min(Number(limit), 100),
      unread as string | undefined
    );
    listResponse(res, result.notifications, {
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      total: result.total,
      totalPages: Math.ceil(result.total / Number(limit)),
    });
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const result = await notificationService.markRead(req.user!.id, id);
    success(res, result);
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllRead(req.user!.id);
    noContent(res);
  }),
};
