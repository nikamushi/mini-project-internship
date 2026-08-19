import type { Request, Response } from "express";
import { reportService } from "../services/report.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler, listResponse, noContent, parseId, success } from "../utils/helpers";

const isAdmin = (req: Request) => req.user?.role === "ADMIN";

export const reportController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const { report } = await reportService.create(req.user!.id, req.body, files);
    success(res, { id: report.id, type: report.type, status: report.status }, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 20,
      q,
      type,
      categoryId,
      status,
      location,
      reporterId,
      sortBy,
      sortOrder,
    } = req.query;
    const result = await reportService.list({
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      q: q as string | undefined,
      type: type as string | undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      status: status as string | undefined,
      location: location as string | undefined,
      reporterId: reporterId ? Number(reporterId) : undefined,
      userId: req.user?.id,
      sortBy: sortBy as "createdAt" | "occurredAt" | undefined,
      sortOrder: sortOrder as "asc" | "desc" | undefined,
      isAdmin: isAdmin(req),
    });
    listResponse(res, result.items, result.meta);
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const report = await reportService.detail(id, req.user);
    success(res, report);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const report = await reportService.update(req.user!.id, req.user!.role, id, req.body);
    success(res, report);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    await reportService.softDelete(req.user!.id, req.user!.role, id);
    noContent(res);
  }),

  addImage: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const file =
      (req.file as Express.Multer.File | undefined) ??
      (req.files as Express.Multer.File[] | undefined)?.[0];
    if (!file) throw ApiError.badRequest("File gambar wajib dikirim.");
    const { url, imageId } = await reportService.addImage(req.user!.id, req.user!.role, id, file);
    success(res, { id: imageId, url }, 201);
  }),

  deleteImage: asyncHandler(async (req: Request, res: Response) => {
    const reportId = parseId(req.params.reportId);
    const imageId = parseId(req.params.imageId);
    if (!reportId || !imageId) throw ApiError.badRequest("ID tidak valid.");
    const result = await reportService.deleteImage(req.user!.id, req.user!.role, reportId, imageId);
    success(res, result);
  }),

  changeStatus: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const result = await reportService.changeStatus(req.user!.id, id, req.body);
    success(res, result);
  }),

  adminDelete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    await reportService.hardDelete(req.user!.id, id);
    noContent(res);
  }),
};
