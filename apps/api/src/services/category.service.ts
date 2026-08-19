import { categoryRepository } from "../repositories/category.repository";
import { ApiError } from "../utils/api-error";
import { activityLogService } from "./activity-log.service";

export const categoryService = {
  list() {
    return categoryRepository.findActive();
  },

  async create(actorId: number, name: string) {
    const normalized = name.trim();
    const existing = await categoryRepository.findByName(normalized);
    if (existing) throw ApiError.conflict("Nama kategori sudah ada.", "CATEGORY_EXISTS");

    const category = await categoryRepository.create(normalized);
    await activityLogService.createLog({
      actorId,
      action: "CATEGORY_CREATED",
      entity: "CATEGORY",
      entityId: category.id,
      metadata: { name: category.name },
    });
    return category;
  },

  async update(actorId: number, id: number, input: { name?: string; isActive?: boolean }) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");

    if (input.name !== undefined && input.name.trim() !== category.name) {
      const duplicate = await categoryRepository.findByName(input.name.trim());
      if (duplicate && duplicate.id !== id) {
        throw ApiError.conflict("Nama kategori sudah ada.", "CATEGORY_EXISTS");
      }
    }

    const updated = await categoryRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
    });
    await activityLogService.createLog({
      actorId,
      action: "CATEGORY_UPDATED",
      entity: "CATEGORY",
      entityId: id,
      metadata: { name: updated.name, isActive: updated.isActive },
    });
    return updated;
  },

  async deactivate(actorId: number, id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
    if (!category.isActive) return category;

    const updated = await categoryRepository.update(id, { isActive: false });
    await activityLogService.createLog({
      actorId,
      action: "CATEGORY_DEACTIVATED",
      entity: "CATEGORY",
      entityId: id,
      metadata: { name: category.name },
    });
    return updated;
  },
};
