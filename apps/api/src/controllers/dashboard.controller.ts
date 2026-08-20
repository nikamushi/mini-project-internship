import type { Request, Response } from "express";
import { activityLogService } from "../services/activity-log.service";
import { dashboardService } from "../services/dashboard.service";
import { asyncHandler, listResponse, success } from "../utils/helpers";
import { parseLimit, parseOptionalInt, parseOptionalString, parsePage } from "../utils/query";

export const dashboardController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.get();
    success(res, data);
  }),

  activityLogs: asyncHandler(async (req: Request, res: Response) => {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const result = await activityLogService.list({
      page,
      limit,
      action: parseOptionalString(req.query.action),
      actorId: parseOptionalInt(req.query.actorId),
      entityType: parseOptionalString(req.query.entityType),
    });
    listResponse(res, result.items, result.meta);
  }),
};