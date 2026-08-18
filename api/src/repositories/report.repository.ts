import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const reportInclude = {
  category: { select: { id: true, name: true } },
  reporter: { select: { id: true, name: true } },
  images: { select: { id: true, url: true } },
} satisfies Prisma.ReportInclude;

export const reportRepository = {
  create(data: Prisma.ReportCreateInput) {
    return prisma.report.create({ data });
  },
  findById(id: number) {
    return prisma.report.findUnique({ where: { id }, include: reportInclude });
  },
  findByIdPlain(id: number) {
    return prisma.report.findUnique({ where: { id } });
  },
  findFirst(where: Prisma.ReportWhereInput) {
    return prisma.report.findFirst({ where });
  },
  count(where: Prisma.ReportWhereInput) {
    return prisma.report.count({ where });
  },
  findMany(args: Prisma.ReportFindManyArgs) {
    return prisma.report.findMany({ ...args, include: reportInclude });
  },
  update(id: number, data: Prisma.ReportUpdateInput) {
    return prisma.report.update({ where: { id }, data });
  },
  updateMany(where: Prisma.ReportWhereInput, data: Prisma.ReportUpdateManyMutationInput) {
    return prisma.report.updateMany({ where, data });
  },
  delete(id: number) {
    return prisma.report.delete({ where: { id } });
  },
};
