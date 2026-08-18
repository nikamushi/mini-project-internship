import { z } from "zod";

export const createClaimSchema = z.object({
  reason: z.string().trim().min(10, "Alasan minimal 10 karakter."),
  evidence: z.string().trim().max(2000).optional(),
});

export const reviewClaimSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], { message: "Status harus APPROVED atau REJECTED." }),
  reason: z.string().trim().max(500).optional(),
});

export const claimQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  reportId: z.coerce.number().int().positive().optional(),
  claimantId: z.coerce.number().int().positive().optional(),
});
