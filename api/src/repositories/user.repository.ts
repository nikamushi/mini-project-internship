import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: { name: string; email: string; passwordHash: string }) {
    return prisma.user.create({ data });
  },
  count(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },
  findMany(args: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  },
  update(id: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },
};
