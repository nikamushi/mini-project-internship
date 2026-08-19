import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const claimInclude = {
  report: {
    include: {
      category: { select: { id: true, name: true } },
      images: { select: { id: true, url: true } },
    },
  },
  claimant: { select: { id: true, name: true, email: true } },
} satisfies Prisma.ClaimInclude;

export const claimRepository = {
  create(data: Prisma.ClaimCreateInput) {
    return prisma.claim.create({ data });
  },
  findById(id: number) {
    return prisma.claim.findUnique({ where: { id }, include: claimInclude });
  },
  findActiveDuplicate(reportId: number, claimantId: number) {
    return prisma.claim.findFirst({
      where: { reportId, claimantId, status: "PENDING" },
    });
  },
  count(where: Prisma.ClaimWhereInput) {
    return prisma.claim.count({ where });
  },
  findMany(args: Prisma.ClaimFindManyArgs) {
    return prisma.claim.findMany({ ...args, include: claimInclude });
  },
  update(id: number, data: Prisma.ClaimUpdateInput) {
    return prisma.claim.update({ where: { id }, data });
  },
};
