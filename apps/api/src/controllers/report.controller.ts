import type { Request, Response } from "express";
import { reportService } from "../services/report.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler, listResponse, noContent, success } from "../utils/helpers";
import {
  parseLimit,
  parseOptionalInt,
  parseOptionalString,
  parsePage,
  parseSortOrder,
} from "../utils/query";

const isAdmin = (req: Request) => req.user?.role === "ADMIN";

export const reportController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const { report } = await reportService.create(req.user!.id, req.body, files);
    success(res, { id: report.id, type: report.type, status: report.status }, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.list({
      page: parsePage(req.query.page),
      limit: parseLimit(req.query.limit),
      q: parseOptionalString(req.query.q),
      type: parseOptionalString(req.query.type),
      categoryId: parseOptionalInt(req.query.categoryId),
      status: parseOptionalString(req.query.status),
      location: parseOptionalString(req.query.location),
      reporterId: parseOptionalInt(req.query.reporterId),
      userId: req.user?.id,
      sortBy: parseOptionalString(req.query.sortBy) as "createdAt" | "occurredAt" | undefined,
      sortOrder: parseSortOrder(req.query.sortOrder),
      isAdmin: isAdmin(req),
    });
    listResponse(res, result.items, result.meta);
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const report = await reportService.detail(Number(req.params.id), req.user);
    success(res, report);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const report = await reportService.update(
      req.user!.id,
      req.user!.role,
      Number(req.params.id),
      req.body
    );
    success(res, report);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await reportService.softDelete(req.user!.id, req.user!.role, Number(req.params.id));
    noContent(res);
  }),

  addImage: asyncHandler(async (req: Request, res: Response) => {
    const file =
      (req.file as Express.Multer.File | undefined) ??
      (req.files as Express.Multer.File[] | undefined)?.[0];
    if (!file) throw ApiError.badRequest("File gambar wajib dikirim.");
    const { url, imageId } = await reportService.addImage(
      req.user!.id,
      req.user!.role,
      Number(req.params.id),
      file
    );
    success(res, { id: imageId, url }, 201);
  }),

  deleteImage: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.deleteImage(
      req.user!.id,
      req.user!.role,
      Number(req.params.reportId),
      Number(req.params.imageId)
    );
    success(res, result);
  }),

  changeStatus: asyncHandler(async (req: Request, res: Response) => {
    const result = await reportService.changeStatus(req.user!.id, Number(req.params.id), req.body);
    success(res, result);
  }),

  adminDelete: asyncHandler(async (req: Request, res: Response) => {
    await reportService.hardDelete(req.user!.id, Number(req.params.id));
    noContent(res);
  }),
};