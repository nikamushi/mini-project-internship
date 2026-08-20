import type { Request, Response } from "express";
import { claimService } from "../services/claim.service";
import { asyncHandler, listResponse, success } from "../utils/helpers";
import { parseLimit, parseOptionalInt, parseOptionalString, parsePage } from "../utils/query";

export const claimController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const claim = await claimService.create(req.user!.id, Number(req.params.reportId), req.body);
    success(res, claim, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await claimService.list({
      page: parsePage(req.query.page),
      limit: parseLimit(req.query.limit),
      userId: req.user!.id,
      role: req.user!.role,
      status: parseOptionalString(req.query.status),
      reportId: parseOptionalInt(req.query.reportId),
    });
    listResponse(res, result.items, result.meta);
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const claim = await claimService.detail(req.user!.id, req.user!.role, Number(req.params.id));
    success(res, claim);
  }),

  cancel: asyncHandler(async (req: Request, res: Response) => {
    const result = await claimService.cancel(req.user!.id, Number(req.params.id));
    success(res, result);
  }),

  review: asyncHandler(async (req: Request, res: Response) => {
    const result = await claimService.review(req.user!.id, Number(req.params.id), req.body);
    success(res, result);
  }),
};