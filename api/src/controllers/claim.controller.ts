import type { Request, Response } from "express";
import { claimService } from "../services/claim.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler, listResponse, parseId, success } from "../utils/helpers";

export const claimController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const reportId = parseId(req.params.reportId);
    if (!reportId) throw ApiError.badRequest("ID tidak valid.");
    const claim = await claimService.create(req.user!.id, reportId, req.body);
    success(res, claim, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 20, status, reportId } = req.query;
    const result = await claimService.list({
      page: Number(page),
      limit: Math.min(Number(limit), 100),
      userId: req.user!.id,
      role: req.user!.role,
      status: status as string | undefined,
      reportId: reportId ? Number(reportId) : undefined,
    });
    listResponse(res, result.items, result.meta);
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const claim = await claimService.detail(req.user!.id, req.user!.role, id);
    success(res, { claim });
  }),

  cancel: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const result = await claimService.cancel(req.user!.id, id);
    success(res, result);
  }),

  review: asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    if (!id) throw ApiError.badRequest("ID tidak valid.");
    const result = await claimService.review(req.user!.id, id, req.body);
    success(res, result);
  }),
};
