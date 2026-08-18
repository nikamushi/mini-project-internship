import { prisma } from "../lib/prisma";

export const categoryRepository = {
  findActive() {
    return prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  },
  findById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  },
  findByName(name: string) {
    return prisma.category.findUnique({ where: { name } });
  },
  create(name: string) {
    return prisma.category.create({ data: { name } });
  },
  update(id: number, data: { name?: string; isActive?: boolean }) {
    return prisma.category.update({ where: { id }, data });
  },
  countInUse(id: number) {
    return prisma.report.count({ where: { categoryId: id, deletedAt: null } });
  },
};
