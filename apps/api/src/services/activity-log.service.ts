import { activityLogRepository } from "../repositories/activity-log.repository";

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
};
