import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const notificationRepository = {
  create(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  },
  count(where: Prisma.NotificationWhereInput) {
    return prisma.notification.count({ where });
  },
  findMany(args: Prisma.NotificationFindManyArgs) {
    return prisma.notification.findMany(args);
  },
  findById(id: number) {
    return prisma.notification.findUnique({ where: { id } });
  },
  update(id: number, data: Prisma.NotificationUpdateInput) {
    return prisma.notification.update({ where: { id }, data });
  },
  updateMany(
    where: Prisma.NotificationWhereInput,
    data: Prisma.NotificationUpdateManyMutationInput
  ) {
    return prisma.notification.updateMany({ where, data });
  },
};
