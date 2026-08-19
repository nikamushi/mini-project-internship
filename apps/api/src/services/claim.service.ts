import { prisma } from "../lib/prisma";
import { claimRepository } from "../repositories/claim.repository";
import { reportRepository } from "../repositories/report.repository";
import { ApiError } from "../utils/api-error";
import { paginationMeta } from "../utils/helpers";
import { activityLogService } from "./activity-log.service";

function claimDto(claim: {
  id: number;
  reason: string;
  evidence: string | null;
  status: string;
  reviewReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  report: {
    id: number;
    type: string;
    itemName: string;
    location: string;
    occurredAt: Date;
    status: string;
    category: { id: number; name: string };
    images: { id: number; url: string }[];
  };
  claimant: { id: number; name: string; email: string };
}) {
  return {
    id: claim.id,
    report: {
      id: claim.report.id,
      type: claim.report.type,
      itemName: claim.report.itemName,
      location: claim.report.location,
      occurredAt: claim.report.occurredAt.toISOString(),
      status: claim.report.status,
      category: claim.report.category,
      images: claim.report.images,
    },
    claimant: claim.claimant,
    reason: claim.reason,
    evidence: claim.evidence,
    status: claim.status,
    reviewReason: claim.reviewReason,
    createdAt: claim.createdAt.toISOString(),
    updatedAt: claim.updatedAt.toISOString(),
  };
}

export const claimService = {
  async create(userId: number, reportId: number, input: { reason: string; evidence?: string }) {
    const report = await reportRepository.findByIdPlain(reportId);
    if (!report || report.deletedAt) {
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    }
    if (report.type !== "FOUND" || report.status !== "ACTIVE") {
      throw ApiError.conflict(
        "Laporan tidak dapat diklaim pada kondisi saat ini.",
        "REPORT_NOT_CLAIMABLE"
      );
    }
    if (report.reporterId === userId) {
      throw ApiError.conflict("Anda tidak dapat mengklaim laporan sendiri.", "SELF_CLAIM");
    }
    const duplicate = await claimRepository.findActiveDuplicate(reportId, userId);
    if (duplicate) {
      throw ApiError.conflict(
        "Anda sudah memiliki klaim aktif untuk laporan ini.",
        "CLAIM_ALREADY_EXISTS"
      );
    }

    const claim = await prisma.$transaction(async (tx) => {
      const created = await tx.claim.create({
        data: {
          report: { connect: { id: reportId } },
          claimant: { connect: { id: userId } },
          reason: input.reason.trim(),
          evidence: input.evidence?.trim() || null,
        },
      });
      await tx.notification.create({
        data: {
          user: { connect: { id: report.reporterId } },
          type: "CLAIM_CREATED",
          title: "Klaim baru masuk",
          message: `Ada klaim baru untuk laporan "${report.itemName}".`,
        },
      });
      await tx.activityLog.create({
        data: {
          actor: { connect: { id: userId } },
          action: "CLAIM_CREATED",
          entity: "CLAIM",
          entityId: created.id,
          metadata: JSON.stringify({ reportId }),
        },
      });
      return created;
    });
    return { id: claim.id, reportId, status: claim.status, createdAt: claim.createdAt };
  },

  async list(params: {
    page: number;
    limit: number;
    userId: number;
    role: string;
    status?: string;
    reportId?: number;
  }) {
    const where = {
      ...(params.role !== "ADMIN" ? { claimantId: params.userId } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.reportId ? { reportId: params.reportId } : {}),
    };
    const [total, claims] = await Promise.all([
      claimRepository.count(where),
      claimRepository.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);
    return { items: claims.map(claimDto), meta: paginationMeta(params.page, params.limit, total) };
  },

  async detail(userId: number, role: string, id: number) {
    const claim = await claimRepository.findById(id);
    if (!claim) throw ApiError.notFound("Klaim tidak ditemukan.", "CLAIM_NOT_FOUND");
    if (role !== "ADMIN" && claim.claimantId !== userId) {
      throw ApiError.notFound("Klaim tidak ditemukan.", "CLAIM_NOT_FOUND");
    }
    return claimDto(claim);
  },

  async cancel(userId: number, id: number) {
    const claim = await claimRepository.findById(id);
    if (!claim) throw ApiError.notFound("Klaim tidak ditemukan.", "CLAIM_NOT_FOUND");
    if (claim.claimantId !== userId) throw ApiError.forbidden();
    if (claim.status !== "PENDING") {
      throw ApiError.conflict(
        "Hanya klaim berstatus PENDING yang dapat dibatalkan.",
        "CLAIM_NOT_REVIEWABLE"
      );
    }

    const updated = await claimRepository.update(id, { status: "CANCELLED" });
    await activityLogService.createLog({
      actorId: userId,
      action: "CLAIM_CANCELLED",
      entity: "CLAIM",
      entityId: id,
    });
    return { id: updated.id, status: updated.status };
  },

  async review(
    adminId: number,
    id: number,
    input: { status: "APPROVED" | "REJECTED"; reason?: string }
  ) {
    const claim = await claimRepository.findById(id);
    if (!claim) throw ApiError.notFound("Klaim tidak ditemukan.", "CLAIM_NOT_FOUND");
    if (claim.status !== "PENDING") {
      throw ApiError.conflict("Klaim sudah diproses.", "CLAIM_NOT_REVIEWABLE");
    }

    const approved = input.status === "APPROVED";

    await prisma.$transaction(async (tx) => {
      await tx.claim.update({
        where: { id },
        data: {
          status: input.status,
          reviewReason: input.reason?.trim() || null,
        },
      });
      if (approved) {
        await tx.report.update({
          where: { id: claim.reportId },
          data: { status: "CLAIMED" },
        });
      }
      await tx.notification.create({
        data: {
          user: { connect: { id: claim.claimantId } },
          type: approved ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
          title: approved ? "Klaim disetujui" : "Klaim ditolak",
          message: approved
            ? "Klaim Anda telah disetujui. Barang telah dihubungkan dengan laporan."
            : `Klaim Anda ditolak.${input.reason ? ` Alasan: ${input.reason}` : ""}`,
        },
      });
      await tx.activityLog.create({
        data: {
          actor: { connect: { id: adminId } },
          action: approved ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
          entity: "CLAIM",
          entityId: id,
          metadata: JSON.stringify({
            reportId: claim.reportId,
            ...(input.reason ? { reviewReason: input.reason } : {}),
          }),
        },
      });
    });

    return { id, status: input.status, reportId: claim.reportId };
  },
};
