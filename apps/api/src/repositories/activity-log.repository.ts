import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const activityLogRepository = {
  create(data: Prisma.ActivityLogCreateInput) {
    return prisma.activityLog.create({ data });
  },
  count(where: Prisma.ActivityLogWhereInput) {
    return prisma.activityLog.count({ where });
  },
  findMany(args: Prisma.ActivityLogFindManyArgs) {
    return prisma.activityLog.findMany({
      ...args,
      include: { actor: { select: { id: true, name: true } } },
    });
  },
};
