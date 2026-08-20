import type { Prisma } from "@prisma/client";
import { activityLogRepository } from "../repositories/activity-log.repository";
import { paginationMeta } from "../utils/helpers";

export const activityLogService = {
  createLog(params: {
    actorId?: number | null;
    action: string;
    entity: string;
    entityId?: number | null;
    metadata?: Record<string, unknown>;
  }): Promise<unknown> {
    return activityLogRepository.create({
      actor: params.actorId ? { connect: { id: params.actorId } } : undefined,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId ?? null,
      metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    });
  },

  async list(params: {
    page: number;
    limit: number;
    action?: string;
    actorId?: number;
    entityType?: string;
  }) {
    const where: Prisma.ActivityLogWhereInput = {
      ...(params.action ? { action: params.action } : {}),
      ...(params.actorId ? { actorId: params.actorId } : {}),
      ...(params.entityType ? { entity: params.entityType } : {}),
    };

    const [total, logs] = await Promise.all([
      activityLogRepository.count(where),
      activityLogRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
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

    return { items, meta: paginationMeta(params.page, params.limit, total) };
  },
};
