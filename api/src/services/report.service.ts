import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { categoryRepository } from "../repositories/category.repository";
import { reportRepository } from "../repositories/report.repository";
import { ApiError } from "../utils/api-error";
import { paginationMeta } from "../utils/helpers";
import { activityLogService } from "./activity-log.service";
import { fileService, type StoredFile } from "./file.service";

const VISIBLE_STATUSES = ["ACTIVE", "FOUND", "CLAIMED", "COMPLETED"];

const REPORT_TRANSITIONS: Record<string, string[]> = {
  PENDING_VERIFICATION: ["ACTIVE", "REJECTED"],
  ACTIVE: ["FOUND", "CLAIMED", "COMPLETED", "CANCELLED"],
  FOUND: ["CLAIMED", "COMPLETED"],
  CLAIMED: ["COMPLETED"],
};

export function canTransition(from: string, to: string): boolean {
  return (REPORT_TRANSITIONS[from] ?? []).includes(to);
}

function reportDto(report: {
  id: number;
  type: string;
  itemName: string;
  description: string;
  location: string;
  occurredAt: Date;
  status: string;
  createdAt: Date;
  category: { id: number; name: string };
  reporter: { id: number; name: string };
  images: { id: number; url: string }[];
}) {
  return {
    id: report.id,
    type: report.type,
    itemName: report.itemName,
    description: report.description,
    location: report.location,
    occurredAt: report.occurredAt.toISOString(),
    status: report.status,
    category: report.category,
    reporter: report.reporter,
    images: report.images,
    createdAt: report.createdAt.toISOString(),
  };
}

export const reportService = {
  async create(
    userId: number,
    input: {
      type: "LOST" | "FOUND";
      itemName: string;
      categoryId: number;
      description: string;
      location: string;
      occurredAt: string;
    },
    files: Express.Multer.File[] = []
  ) {
    const category = await categoryRepository.findById(input.categoryId);
    if (!category || !category.isActive) {
      throw ApiError.notFound("Kategori tidak ditemukan.", "CATEGORY_NOT_FOUND");
    }

    const savedFiles: StoredFile[] = [];
    try {
      for (const file of files) {
        savedFiles.push(await fileService.save(file));
      }
      const report = await prisma.$transaction(async (tx) => {
        const created = await tx.report.create({
          data: {
            reporter: { connect: { id: userId } },
            category: { connect: { id: input.categoryId } },
            type: input.type,
            itemName: input.itemName.trim(),
            description: input.description.trim(),
            location: input.location.trim(),
            occurredAt: new Date(input.occurredAt),
            images: savedFiles.length
              ? { create: savedFiles.map((f) => ({ url: f.url })) }
              : undefined,
          },
        });
        await tx.activityLog.create({
          data: {
            actor: { connect: { id: userId } },
            action: "REPORT_CREATED",
            entity: "REPORT",
            entityId: created.id,
            metadata: JSON.stringify({ type: input.type, itemName: input.itemName }),
          },
        });
        return created;
      });
      return { report, savedFiles };
    } catch (err) {
      await fileService.cleanup(savedFiles);
      throw err;
    }
  },

  async list(params: {
    page: number;
    limit: number;
    q?: string;
    type?: string;
    categoryId?: number;
    status?: string;
    location?: string;
    sortBy?: "createdAt" | "occurredAt";
    sortOrder?: "asc" | "desc";
    isAdmin: boolean;
  }) {
    const where: Prisma.ReportWhereInput = { deletedAt: null };
    if (params.q) {
      where.OR = [
        { itemName: { contains: params.q } },
        { description: { contains: params.q } },
        { location: { contains: params.q } },
      ];
    }
    if (params.type) where.type = params.type;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.location) where.location = { contains: params.location };
    if (params.status) {
      where.status = params.isAdmin ? params.status : params.status;
      if (!params.isAdmin && !VISIBLE_STATUSES.includes(params.status)) {
        where.status = "__HIDDEN__";
      }
    } else if (!params.isAdmin) {
      where.status = { in: VISIBLE_STATUSES };
    }

    const [total, reports] = await Promise.all([
      reportRepository.count(where),
      reportRepository.findMany({
        where,
        orderBy: { [params.sortBy ?? "createdAt"]: params.sortOrder ?? "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
    ]);
    return {
      items: reports.map(reportDto),
      meta: paginationMeta(params.page, params.limit, total),
    };
  },

  async detail(id: number, viewer?: { id: number; role: string }) {
    const report = await reportRepository.findById(id);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (viewer && viewer.role !== "ADMIN") {
      const visible = VISIBLE_STATUSES.includes(report.status) || report.reporterId === viewer.id;
      if (!visible) throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    }
    return reportDto(report);
  },

  async update(
    userId: number,
    role: string,
    id: number,
    input: { itemName?: string; description?: string; location?: string; occurredAt?: string }
  ) {
    const report = await reportRepository.findByIdPlain(id);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (role !== "ADMIN") {
      if (report.reporterId !== userId) throw ApiError.forbidden();
      if (!["PENDING_VERIFICATION", "ACTIVE"].includes(report.status)) {
        throw ApiError.conflict(
          "Laporan tidak dapat diedit pada status ini.",
          "REPORT_NOT_EDITABLE"
        );
      }
    }

    const updated = await reportRepository.update(id, {
      ...(input.itemName !== undefined ? { itemName: input.itemName.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description.trim() } : {}),
      ...(input.location !== undefined ? { location: input.location.trim() } : {}),
      ...(input.occurredAt !== undefined ? { occurredAt: new Date(input.occurredAt) } : {}),
    });
    await activityLogService.createLog({
      actorId: userId,
      action: "REPORT_UPDATED",
      entity: "REPORT",
      entityId: id,
    });
    return updated;
  },

  async softDelete(userId: number, role: string, id: number) {
    const report = await reportRepository.findByIdPlain(id);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (role !== "ADMIN" && report.reporterId !== userId) throw ApiError.forbidden();

    const updated = await reportRepository.update(id, { deletedAt: new Date() });
    await activityLogService.createLog({
      actorId: userId,
      action: "REPORT_DELETED",
      entity: "REPORT",
      entityId: id,
    });
    return updated;
  },

  async hardDelete(userId: number, id: number) {
    const report = await reportRepository.findByIdPlain(id);
    if (!report) throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");

    const images = await prisma.reportImage.findMany({ where: { reportId: id } });
    await prisma.$transaction(async (tx) => {
      await tx.reportImage.deleteMany({ where: { reportId: id } });
      await tx.report.delete({ where: { id } });
      await tx.activityLog.create({
        data: {
          actor: { connect: { id: userId } },
          action: "REPORT_DELETED",
          entity: "REPORT",
          entityId: id,
          metadata: JSON.stringify({ hardDelete: true }),
        },
      });
    });
    await Promise.all(images.map((img) => fileService.deleteFromUrl(img.url)));
  },

  async changeStatus(adminId: number, id: number, input: { status: string; adminNote?: string }) {
    const report = await reportRepository.findByIdPlain(id);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (report.status === input.status) return report;
    if (!canTransition(report.status, input.status)) {
      throw ApiError.conflict(
        `Status tidak dapat berubah dari ${report.status} ke ${input.status}.`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    const approved = input.status === "ACTIVE";
    const rejected = input.status === "REJECTED";
    const notificationType = approved
      ? "REPORT_APPROVED"
      : rejected
        ? "REPORT_REJECTED"
        : "REPORT_STATUS_CHANGED";
    const title = approved
      ? "Laporan disetujui"
      : rejected
        ? "Laporan ditolak"
        : "Status laporan berubah";
    const message = approved
      ? `Laporan "${report.itemName}" telah disetujui dan aktif.`
      : rejected
        ? `Laporan "${report.itemName}" ditolak.${input.adminNote ? ` Alasan: ${input.adminNote}` : ""}`
        : `Status laporan "${report.itemName}" berubah menjadi ${input.status}.`;

    await prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id },
        data: { status: input.status },
      });
      await tx.notification.create({
        data: {
          user: { connect: { id: report.reporterId } },
          type: notificationType,
          title,
          message,
        },
      });
      await tx.activityLog.create({
        data: {
          actor: { connect: { id: adminId } },
          action: approved
            ? "REPORT_APPROVED"
            : rejected
              ? "REPORT_REJECTED"
              : "REPORT_STATUS_CHANGED",
          entity: "REPORT",
          entityId: id,
          metadata: JSON.stringify({
            oldStatus: report.status,
            newStatus: input.status,
            ...(input.adminNote ? { adminNote: input.adminNote } : {}),
          }),
        },
      });
    });
    return { id, status: input.status };
  },

  async addImage(
    userId: number,
    role: string,
    id: number,
    file: Express.Multer.File
  ): Promise<StoredFile & { imageId: number }> {
    const report = await reportRepository.findByIdPlain(id);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (role !== "ADMIN") {
      if (report.reporterId !== userId) throw ApiError.forbidden();
      if (report.status === "COMPLETED") {
        throw ApiError.conflict(
          "Gambar tidak dapat ditambahkan pada laporan selesai.",
          "REPORT_NOT_EDITABLE"
        );
      }
    }
    const count = await prisma.reportImage.count({ where: { reportId: id } });
    if (count >= 5) throw ApiError.conflict("Maksimal 5 gambar per laporan.", "MAX_IMAGES_REACHED");

    const stored = await fileService.save(file);
    try {
      const image = await prisma.reportImage.create({
        data: { report: { connect: { id } }, url: stored.url },
      });
      return { url: stored.url, absolutePath: stored.absolutePath, imageId: image.id };
    } catch (err) {
      await fileService.delete(stored.absolutePath);
      throw err;
    }
  },

  async deleteImage(userId: number, role: string, reportId: number, imageId: number) {
    const report = await reportRepository.findByIdPlain(reportId);
    if (!report || report.deletedAt)
      throw ApiError.notFound("Laporan tidak ditemukan.", "REPORT_NOT_FOUND");
    if (role !== "ADMIN") {
      if (report.reporterId !== userId) throw ApiError.forbidden();
      if (report.status === "COMPLETED") {
        throw ApiError.conflict(
          "Gambar tidak dapat dihapus pada laporan selesai.",
          "REPORT_NOT_EDITABLE"
        );
      }
    }
    const image = await prisma.reportImage.findFirst({ where: { id: imageId, reportId } });
    if (!image) throw ApiError.notFound("Gambar tidak ditemukan.");

    await prisma.reportImage.delete({ where: { id: imageId } });
    await fileService.deleteFromUrl(image.url);
    return { id: imageId, deleted: true };
  },
};
