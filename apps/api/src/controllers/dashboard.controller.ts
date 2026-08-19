import type { Request, Response } from "express";
import { activityLogRepository } from "../repositories/activity-log.repository";
import { dashboardService } from "../services/dashboard.service";
import { asyncHandler, listResponse, success } from "../utils/helpers";

export const dashboardController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const data = await dashboardService.get();
    success(res, data);
  }),

  activityLogs: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, action, actorId, entityType } = req.query;
    const where = {
      ...(action ? { action: action as string } : {}),
      ...(actorId ? { actorId: Number(actorId) } : {}),
      ...(entityType ? { entity: entityType as string } : {}),
    };
    const [total, logs] = await Promise.all([
      activityLogRepository.count(where),
      activityLogRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Math.min(Number(limit), 100),
      }),
    ]);
    const items = logs.map((log) => ({
      id: log.id,
      actor: log.actor,
      entityType: log.entity,
      entityId: log.entityId,
      action: log.action,
      metadata: log.metadata ? JSON.parse(log.metadata) : null,
      createdAt: log.createdAt.toISOString(),
    }));
    listResponse(res, items, {
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      total,
      totalPages: Math.ceil(total / Math.min(Number(limit), 100)),
    });
  }),
};
