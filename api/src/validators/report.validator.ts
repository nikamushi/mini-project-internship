import { z } from "zod";

export const createReportSchema = z.object({
  type: z.enum(["LOST", "FOUND"], { message: "Tipe report harus LOST atau FOUND." }),
  itemName: z
    .string()
    .trim()
    .min(2, "Nama barang minimal 2 karakter.")
    .max(150, "Nama barang maksimal 150 karakter."),
  categoryId: z.coerce.number().int().positive("Kategori wajib diisi."),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter."),
  location: z
    .string()
    .trim()
    .min(2, "Lokasi minimal 2 karakter.")
    .max(255, "Lokasi maksimal 255 karakter."),
  occurredAt: z.string().datetime({ message: "Waktu kejadian tidak valid." }),
});

export const updateReportSchema = z
  .object({
    itemName: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().min(10).optional(),
    location: z.string().trim().min(2).max(255).optional(),
    occurredAt: z.string().datetime().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "Tidak ada field yang dikirim." });

export const updateReportStatusSchema = z.object({
  status: z.enum(["ACTIVE", "REJECTED", "FOUND", "CLAIMED", "COMPLETED", "CANCELLED"], {
    message: "Status tidak valid.",
  }),
  adminNote: z.string().trim().max(500).optional(),
});

export const reportQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  q: z.string().trim().optional(),
  type: z.enum(["LOST", "FOUND"]).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  location: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "occurredAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
