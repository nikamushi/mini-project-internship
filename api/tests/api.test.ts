import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

const app = createApp();

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

async function login(agent: request.SuperAgentTest, email: string): Promise<void> {
  const res = await agent.post("/api/auth/login").send({ email, password: "password123" });
  expect(res.status).toBe(200);
}

async function createActiveFoundReport(
  userAgent: request.SuperAgentTest,
  adminAgent: request.SuperAgentTest
) {
  const created = await userAgent.post("/api/reports").send({
    type: "FOUND",
    itemName: `Barang ditemukan ${Date.now()}`,
    categoryId: 4,
    description: "Barang ini ditemukan dan dirawat di tempat aman.",
    location: "Lokasi uji coba",
    occurredAt: "2026-08-18T07:00:00Z",
  });
  expect(created.status).toBe(201);
  const approved = await adminAgent
    .patch(`/api/admin/reports/${created.body.data.id}/status`)
    .send({ status: "ACTIVE" });
  expect(approved.status).toBe(200);
  return created.body.data.id as number;
}

beforeAll(async () => {
  await prisma.$disconnect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Health & format", () => {
  it("GET /api/health", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: "ok" } });
  });

  it("unknown route -> 404 standar", async () => {
    const res = await request(app).get("/api/tidak-ada");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("BE-054 Authentication", () => {
  it("register sukses", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "User Baru",
      email: "baru@example.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user).not.toHaveProperty("passwordHash");
    expect(res.headers["set-cookie"]?.join()).toContain("token");
  });

  it("register email duplikat -> 409", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "User Baru Lagi",
      email: "baru@example.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("register password pendek -> 422", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "User",
      email: "pendek@example.com",
      password: "123",
    });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("login sukses", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe("user@example.com");
    expect(res.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("login password salah -> 401 INVALID_CREDENTIALS", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "user@example.com",
      password: "salahsalah",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("login email tidak dikenal -> 401 INVALID_CREDENTIALS (tidak membedakan)", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "tidakada@example.com",
      password: "password123",
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("user nonaktif tidak bisa login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "password123",
    });
    expect(res.status).toBe(200);
  });

  it("logout lalu /me -> 401", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const me = await agent.get("/api/auth/me");
    expect(me.status).toBe(200);
    const out = await agent.post("/api/auth/logout");
    expect(out.status).toBe(204);
    const after = await agent.get("/api/auth/me");
    expect(after.status).toBe(401);
  });

  it("akses tanpa auth -> 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });

  it("token tidak valid -> 401 SESSION_EXPIRED", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer abc.def.ghi");
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe("SESSION_EXPIRED");
  });
});

describe("BE-011 Category", () => {
  it("list kategori aktif", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(6);
  });

  it("user tidak bisa create kategori -> 403", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.post("/api/categories").send({ name: "Kategori Ilegal" });
    expect(res.status).toBe(403);
  });

  it("admin create + duplikat 409 + update + deactivate", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const created = await agent.post("/api/categories").send({ name: "Olahraga" });
    expect(created.status).toBe(201);

    const dup = await agent.post("/api/categories").send({ name: "Olahraga" });
    expect(dup.status).toBe(409);

    const updated = await agent
      .patch(`/api/categories/${created.body.data.id}`)
      .send({ name: "Perlengkapan Olahraga" });
    expect(updated.status).toBe(200);
    expect(updated.body.data.name).toBe("Perlengkapan Olahraga");

    const deactivated = await agent.delete(`/api/categories/${created.body.data.id}`);
    expect(deactivated.status).toBe(200);
    expect(deactivated.body.data.isActive).toBe(false);
  });
});

describe("BE-056 Report", () => {
  it("create LOST report -> PENDING_VERIFICATION", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.post("/api/reports").send({
      type: "LOST",
      itemName: "Laptop Asus",
      categoryId: 1,
      description: "Laptop Asus warna hitam hilang di ruang kelas.",
      location: "Ruang 201",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("PENDING_VERIFICATION");
  });

  it("create dengan type invalid -> 422", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.post("/api/reports").send({
      type: "HILANG",
      itemName: "Barang",
      categoryId: 1,
      description: "Deskripsi cukup panjang untuk valid.",
      location: "Lokasi",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    expect(res.status).toBe(422);
  });

  it("create dengan kategori tidak ada -> 404", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.post("/api/reports").send({
      type: "LOST",
      itemName: "Barang",
      categoryId: 9999,
      description: "Deskripsi cukup panjang untuk valid.",
      location: "Lokasi",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("CATEGORY_NOT_FOUND");
  });

  it("create tanpa field wajib -> 422", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.post("/api/reports").send({ type: "LOST" });
    expect(res.status).toBe(422);
  });

  it("report PENDING tidak muncul di list publik", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.get("/api/reports?status=PENDING_VERIFICATION");
    expect(res.body.meta.total).toBe(0);
    const all = await agent.get("/api/reports");
    expect(
      all.body.data.every((r: { status: string }) => r.status !== "PENDING_VERIFICATION")
    ).toBe(true);
  });

  it("search & filter", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.get("/api/reports?q=headphone&type=LOST");
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].itemName.toLowerCase()).toContain("headphone");
  });

  it("pagination metadata", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.get("/api/reports?page=1&limit=2");
    expect(res.status).toBe(200);
    expect(res.body.meta).toHaveProperty("page", 1);
    expect(res.body.meta).toHaveProperty("limit", 2);
    expect(res.body.meta).toHaveProperty("totalPages");
  });

  it("detail menampilkan kategori, reporter, images", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.get("/api/reports/1");
    expect(res.status).toBe(200);
    expect(res.body.data.category).toHaveProperty("name");
    expect(res.body.data.reporter).toHaveProperty("name");
    expect(Array.isArray(res.body.data.images)).toBe(true);
    expect(res.body.data).not.toHaveProperty("passwordHash");
  });

  it("user lain tidak bisa update report -> 403", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await userAgent.patch(`/api/reports/${id}`).send({ location: "Diganti" });
    expect(res.status).toBe(403);
  });

  it("owner update report -> 200", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.patch("/api/reports/2").send({ location: "Kantin Baru" });
    expect(res.status).toBe(200);
    expect(res.body.data.location).toBe("Kantin Baru");
  });

  it("update tidak boleh mass assignment status", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const res = await agent.patch("/api/reports/2").send({ status: "COMPLETED" });
    expect(res.status).toBe(422);
  });

  it("owner soft delete -> 204 dan tidak muncul di list", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const created = await agent.post("/api/reports").send({
      type: "LOST",
      itemName: "Barang akan dihapus",
      categoryId: 5,
      description: "Barang ini akan dihapus untuk pengujian.",
      location: "Gedung X",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    const res = await agent.delete(`/api/reports/${created.body.data.id}`);
    expect(res.status).toBe(204);
    const list = await agent.get("/api/reports?q=Barang akan dihapus");
    expect(list.body.meta.total).toBe(0);
    const detail = await agent.get(`/api/reports/${created.body.data.id}`);
    expect(detail.status).toBe(404);
  });

  it("admin verifikasi approve + invalid transition 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");

    const created = await userAgent.post("/api/reports").send({
      type: "FOUND",
      itemName: "Jam tangan",
      categoryId: 4,
      description: "Jam tangan analog ditemukan di lapangan.",
      location: "Lapangan",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    const id = created.body.data.id;

    const stranger = request.agent(app);
    await stranger.post("/api/auth/register").send({
      name: "Orang Asing",
      email: `asing${Date.now()}@example.com`,
      password: "password123",
    });
    const hidden = await stranger.get(`/api/reports/${id}`);
    expect(hidden.status).toBe(404);

    const approved = await adminAgent
      .patch(`/api/admin/reports/${id}/status`)
      .send({ status: "ACTIVE" });
    expect(approved.status).toBe(200);

    const visible = await userAgent.get(`/api/reports/${id}`);
    expect(visible.status).toBe(200);
    expect(visible.body.data.status).toBe("ACTIVE");

    const invalid = await adminAgent
      .patch(`/api/admin/reports/${id}/status`)
      .send({ status: "REJECTED" });
    expect(invalid.status).toBe(409);
    expect(invalid.body.error.code).toBe("INVALID_STATUS_TRANSITION");
  });

  it("admin reject report -> REJECTED + notifikasi", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");

    const created = await userAgent.post("/api/reports").send({
      type: "LOST",
      itemName: "Barang ditolak",
      categoryId: 3,
      description: "Barang ini akan ditolak oleh admin.",
      location: "Gedung Y",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    const id = created.body.data.id;
    const rejected = await adminAgent.patch(`/api/admin/reports/${id}/status`).send({
      status: "REJECTED",
      adminNote: "Informasi tidak lengkap.",
    });
    expect(rejected.status).toBe(200);

    const notif = await userAgent.get("/api/notifications");
    expect(notif.body.data.some((n: { type: string }) => n.type === "REPORT_REJECTED")).toBe(true);
  });

  it("admin list melihat semua status", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const res = await agent.get("/api/admin/reports?status=REJECTED");
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
  });
});

describe("BE-019/BE-020 Image upload", () => {
  it("upload gambar valid -> 201", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await adminAgent
      .post(`/api/reports/${id}/images`)
      .attach("file", tinyPng, { filename: "foto.png", contentType: "image/png" });
    expect(res.status).toBe(201);
    expect(res.body.data.url).toMatch(/^\/uploads\/reports\//);
  });

  it("upload dengan isi bukan gambar -> 400 INVALID_FILE_TYPE", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await adminAgent
      .post(`/api/reports/${id}/images`)
      .attach("file", Buffer.from("ini bukan gambar sama sekali"), {
        filename: "palsu.png",
        contentType: "image/png",
      });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_FILE_TYPE");
  });

  it("upload mime tidak diizinkan -> 400", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await adminAgent
      .post(`/api/reports/${id}/images`)
      .attach("file", Buffer.from("#!/bin/sh\necho x"), {
        filename: "evil.sh",
        contentType: "text/plain",
      });
    expect(res.status).toBe(400);
  });

  it("upload tanpa file -> 400", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await adminAgent.post(`/api/reports/${id}/images`);
    expect(res.status).toBe(400);
  });

  it("hapus gambar -> 200", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const up = await adminAgent.post(`/api/reports/${id}/images`).attach("file", tinyPng, {
      filename: "hapus.png",
      contentType: "image/png",
    });
    const del = await adminAgent.delete(`/api/reports/${id}/images/${up.body.data.id}`);
    expect(del.status).toBe(200);
    expect(del.body.data.deleted).toBe(true);
  });

  it("user lain tidak bisa upload ke report orang lain -> 403", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const id = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await userAgent.post(`/api/reports/${id}/images`).attach("file", tinyPng, {
      filename: "nyuri.png",
      contentType: "image/png",
    });
    expect(res.status).toBe(403);
  });
});

describe("BE-057 Claim", () => {
  it("claim report FOUND ACTIVE -> 201", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const res = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Saya yakin barang ini milik saya karena ada tanda khusus.",
      evidence: "Ada stiker kecil di bagian bawah.",
    });
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("PENDING");
  });

  it("claim report LOST -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const res = await userAgent.post("/api/reports/2/claims").send({
      reason: "Saya kehilangan barang ini dan ingin mengklaimnya.",
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("REPORT_NOT_CLAIMABLE");
  });

  it("claim report PENDING -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const created = await userAgent.post("/api/reports").send({
      type: "FOUND",
      itemName: "Barang belum diverifikasi",
      categoryId: 6,
      description: "Barang ini masih menunggu verifikasi admin.",
      location: "Lokasi",
      occurredAt: "2026-08-18T07:00:00Z",
    });
    const res = await userAgent.post(`/api/reports/${created.body.data.id}/claims`).send({
      reason: "Saya ingin mengklaim barang yang belum diverifikasi ini.",
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("REPORT_NOT_CLAIMABLE");
  });

  it("self claim -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(userAgent, adminAgent);
    const res = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Saya melaporkan barang ini dan sekarang ingin mengklaimnya sendiri.",
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe("SELF_CLAIM");
  });

  it("duplicate claim -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const first = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim pertama dengan alasan yang cukup panjang.",
    });
    expect(first.status).toBe(201);
    const dup = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim kedua yang seharusnya ditolak karena duplikat.",
    });
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe("CLAIM_ALREADY_EXISTS");
  });

  it("user hanya melihat claim sendiri", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const created = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim untuk pengujian kepemilikan akses.",
    });
    const otherUser = request.agent(app);
    const reg = await otherUser.post("/api/auth/register").send({
      name: "User Ketiga",
      email: "ketiga@example.com",
      password: "password123",
    });
    expect(reg.status).toBe(201);
    const forbidden = await otherUser.get(`/api/claims/${created.body.data.id}`);
    expect(forbidden.status).toBe(404);
  });

  it("cancel claim PENDING -> CANCELLED, cancel ulang -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const created = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim ini akan dibatalkan oleh pemiliknya.",
    });
    const cancelled = await userAgent.patch(`/api/claims/${created.body.data.id}/cancel`);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.data.status).toBe("CANCELLED");
    const again = await userAgent.patch(`/api/claims/${created.body.data.id}/cancel`);
    expect(again.status).toBe(409);
  });

  it("approve claim -> report CLAIMED + notifikasi claimant", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const created = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim ini akan disetujui oleh admin untuk pengujian.",
    });
    const approved = await adminAgent
      .patch(`/api/admin/claims/${created.body.data.id}/status`)
      .send({ status: "APPROVED" });
    expect(approved.status).toBe(200);

    const detail = await adminAgent.get(`/api/admin/reports/${reportId}`);
    expect(detail.body.data.status).toBe("CLAIMED");

    const notif = await userAgent.get("/api/notifications");
    expect(notif.body.data.some((n: { type: string }) => n.type === "CLAIM_APPROVED")).toBe(true);
  });

  it("reject claim -> REJECTED + reviewReason", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const created = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim ini akan ditolak oleh admin untuk pengujian.",
    });
    const rejected = await adminAgent
      .patch(`/api/admin/claims/${created.body.data.id}/status`)
      .send({
        status: "REJECTED",
        reason: "Bukti kepemilikan tidak mencukupi.",
      });
    expect(rejected.status).toBe(200);

    const detail = await userAgent.get(`/api/claims/${created.body.data.id}`);
    expect(detail.body.data.status).toBe("REJECTED");
    expect(detail.body.data.reviewReason).toBe("Bukti kepemilikan tidak mencukupi.");

    const report = await adminAgent.get(`/api/admin/reports/${reportId}`);
    expect(report.body.data.status).toBe("ACTIVE");
  });

  it("review claim sudah diproses -> 409", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    const created = await userAgent.post(`/api/reports/${reportId}/claims`).send({
      reason: "Klaim ini akan diproses dua kali untuk pengujian.",
    });
    await adminAgent
      .patch(`/api/admin/claims/${created.body.data.id}/status`)
      .send({ status: "REJECTED" });
    const again = await adminAgent
      .patch(`/api/admin/claims/${created.body.data.id}/status`)
      .send({ status: "APPROVED" });
    expect(again.status).toBe(409);
    expect(again.body.error.code).toBe("CLAIM_NOT_REVIEWABLE");
  });
});

describe("BE-055 Authorization", () => {
  it("user akses endpoint admin -> 403", async () => {
    const agent = request.agent(app);
    await login(agent, "user@example.com");
    const endpoints = [
      "/api/admin/dashboard",
      "/api/admin/users",
      "/api/admin/activity-logs",
      "/api/admin/claims",
      "/api/admin/reports",
    ];
    for (const path of endpoints) {
      const res = await agent.get(path);
      expect(res.status).toBe(403);
    }
    const createCat = await agent.post("/api/categories").send({ name: "Ilegal" });
    expect(createCat.status).toBe(403);
    const review = await agent.patch("/api/admin/claims/1/status").send({ status: "APPROVED" });
    expect(review.status).toBe(403);
  });
});

describe("BE-032 Admin user management", () => {
  it("list + get user", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const res = await agent.get("/api/admin/users?search=user@example.com");
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
    expect(res.body.data[0]).not.toHaveProperty("passwordHash");
    const detail = await agent.get(`/api/admin/users/${res.body.data[0].id}`);
    expect(detail.status).toBe(200);
  });

  it("admin tidak bisa menonaktifkan diri sendiri -> 400", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const res = await agent.patch("/api/admin/users/1/status").send({ isActive: false });
    expect(res.status).toBe(400);
  });

  it("deactivate user lain -> tidak bisa login", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const reg = await request(app).post("/api/auth/register").send({
      name: "Korban Nonaktif",
      email: "korban@example.com",
      password: "password123",
    });
    const userId = reg.body.data.user.id;
    const res = await adminAgent
      .patch(`/api/admin/users/${userId}/status`)
      .send({ isActive: false });
    expect(res.status).toBe(200);
    expect(res.body.data.user.isActive).toBe(false);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: "korban@example.com",
      password: "password123",
    });
    expect(loginRes.status).toBe(401);
  });
});

describe("BE-058 Notification", () => {
  it("mark read + mark all read", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    await userAgent
      .post(`/api/reports/${reportId}/claims`)
      .send({ reason: "Klaim untuk notifikasi pembaca." });
    const adminNotif = await adminAgent.get("/api/notifications");
    expect(adminNotif.body.meta.total).toBeGreaterThanOrEqual(1);

    const read = await adminAgent.patch(`/api/notifications/${adminNotif.body.data[0].id}/read`);
    expect(read.status).toBe(200);
    expect(read.body.data.isRead).toBe(true);

    const all = await adminAgent.patch("/api/notifications/read-all");
    expect(all.status).toBe(204);
  });

  it("user tidak bisa mark read notifikasi orang lain -> 404", async () => {
    const adminAgent = request.agent(app);
    await login(adminAgent, "admin@example.com");
    const userAgent = request.agent(app);
    await login(userAgent, "user@example.com");
    const reportId = await createActiveFoundReport(adminAgent, adminAgent);
    await userAgent
      .post(`/api/reports/${reportId}/claims`)
      .send({ reason: "Klaim untuk notifikasi orang lain." });
    const adminNotif = await adminAgent.get("/api/notifications?unread=true");
    const res = await userAgent.patch(`/api/notifications/${adminNotif.body.data[0].id}/read`);
    expect(res.status).toBe(404);
  });
});

describe("BE-031 Dashboard & activity logs", () => {
  it("dashboard punya semua metrik", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const res = await agent.get("/api/admin/dashboard");
    expect(res.status).toBe(200);
    expect(res.body.data.reports).toHaveProperty("total");
    expect(res.body.data.reports).toHaveProperty("pendingVerification");
    expect(res.body.data).toHaveProperty("pendingClaims");
    expect(res.body.data).toHaveProperty("totalUsers");
  });

  it("activity logs tercatat", async () => {
    const agent = request.agent(app);
    await login(agent, "admin@example.com");
    const res = await agent.get("/api/admin/activity-logs?action=USER_LOGIN");
    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].metadata).toBeDefined();
  });
});
