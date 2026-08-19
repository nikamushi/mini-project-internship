import type { Prisma } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { paginationMeta } from "../utils/helpers";
import { activityLogService } from "./activity-log.service";

export const userService = {
  async list(params: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }) {
    const where: Prisma.UserWhereInput = {};
    if (params.search) {
      where.OR = [{ name: { contains: params.search } }, { email: { contains: params.search } }];
    }
    if (params.role) where.role = params.role;
    if (params.isActive !== undefined) where.isActive = params.isActive;

    const [total, users] = await Promise.all([
      userRepository.count(where),
      userRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ]);
    return { users, meta: paginationMeta(params.page, params.limit, total) };
  },

  async get(id: number) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User tidak ditemukan.");
    const { id: userId, name, email, role, isActive, createdAt } = user;
    return { id: userId, name, email, role, isActive, createdAt };
  },

  async setStatus(actorId: number, id: number, isActive: boolean) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User tidak ditemukan.");
    if (!isActive && actorId === id) {
      throw ApiError.badRequest("Tidak dapat menonaktifkan akun sendiri.");
    }
    const updated = await userRepository.update(id, { isActive });
    if (!isActive) {
      await activityLogService.createLog({
        actorId,
        action: "USER_DEACTIVATED",
        entity: "USER",
        entityId: id,
        metadata: { email: user.email },
      });
    }
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
    };
  },
};
