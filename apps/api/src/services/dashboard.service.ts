import { prisma } from "../lib/prisma";

export const dashboardService = {
  async get() {
    const [
      total,
      pendingVerification,
      active,
      completed,
      lostReports,
      foundReports,
      pendingClaims,
      totalUsers,
    ] = await Promise.all([
      prisma.report.count({ where: { deletedAt: null } }),
      prisma.report.count({ where: { deletedAt: null, status: "PENDING_VERIFICATION" } }),
      prisma.report.count({ where: { deletedAt: null, status: "ACTIVE" } }),
      prisma.report.count({ where: { deletedAt: null, status: "COMPLETED" } }),
      prisma.report.count({ where: { deletedAt: null, type: "LOST" } }),
      prisma.report.count({ where: { deletedAt: null, type: "FOUND" } }),
      prisma.claim.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);
    return {
      reports: { total, pendingVerification, active, completed },
      lostReports,
      foundReports,
      pendingClaims,
      totalUsers,
    };
  },
};
