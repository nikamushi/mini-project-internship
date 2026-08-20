import type { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { asyncHandler, success } from "../utils/helpers";

export const categoryController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoryService.list();
    success(res, categories);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.user!.id, req.body.name);
    success(res, category, 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.update(req.user!.id, Number(req.params.id), req.body);
    success(res, category);
  }),

  deactivate: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.deactivate(req.user!.id, Number(req.params.id));
    success(res, category);
  }),
};