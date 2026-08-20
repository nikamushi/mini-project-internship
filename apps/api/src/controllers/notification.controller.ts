import type { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { asyncHandler, listResponse, noContent, success } from "../utils/helpers";
import { parseLimit, parseOptionalString, parsePage } from "../utils/query";

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const result = await notificationService.list(
      req.user!.id,
      page,
      limit,
      parseOptionalString(req.query.unread)
    );
    listResponse(res, result.notifications, {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    });
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    const result = await notificationService.markRead(req.user!.id, Number(req.params.id));
    success(res, result);
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    await notificationService.markAllRead(req.user!.id);
    noContent(res);
  }),
};