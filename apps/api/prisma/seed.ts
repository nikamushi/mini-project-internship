import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORY_NAMES,
  CLAIM_REASONS,
  REJECT_REASONS,
  SEED_ITEMS,
  SEED_USERS,
  STATUS_CYCLE,
} from "./seed-data";

const prisma = new PrismaClient();

const DAY_MS = 86_400_000;
const daysAgo = (n: number): Date => new Date(Date.now() - n * DAY_MS);

type ClaimPlanStatus = "APPROVED" | "REJECTED" | "CANCELLED" | "PENDING";
const CLAIM_PLAN: ClaimPlanStatus[] = [
  "APPROVED",
  "APPROVED",
  "APPROVED",
  "APPROVED",
  "REJECTED",
  "REJECTED",
  "CANCELLED",
  "PENDING",
  "PENDING",
  "PENDING",
  "PENDING",
  "PENDING",
];

export async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash("password123", 10);

  const users = [];
  for (const u of SEED_USERS) {
    users.push(
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, passwordHash },
      }),
    );
  }
  const adminId = users[0]!.id;

  const categories = [];
  for (const name of CATEGORY_NAMES) {
    categories.push(await prisma.category.upsert({ where: { name }, update: {}, create: { name } }));
  }
  const catId = (cat: string) => categories.find((c) => c.name === cat)!.id;

  const reports = [];
  for (let i = 0; i < SEED_ITEMS.length; i++) {
    const item = SEED_ITEMS[i]!;
    const reporter = users[i % users.length]!;
    const type = i % 2 === 0 ? "FOUND" : "LOST";
    const status = STATUS_CYCLE[i % STATUS_CYCLE.length]!;
    const occurredAt = daysAgo(((i * 7) % 60) + 1);
    const report = await prisma.report.create({
      data: {
        reporterId: reporter.id,
        categoryId: catId(item.cat),
        type,
        itemName: item.name,
        description: item.desc,
        location: item.loc,
        occurredAt,
        status,
        createdAt: daysAgo(((i * 7) % 60) + 2),
      },
    });

    for (const k of [0, 1]) {
      await prisma.reportImage.create({
        data: {
          reportId: report.id,
          url: `https://picsum.photos/seed/laf-${i}-${k}/640/480`,
        },
      });
    }

    if (status !== "PENDING_VERIFICATION") {
      const rejected = status === "REJECTED";
      const reviewedAt = daysAgo(Math.floor(((i * 7) % 60) / 2));
      await prisma.notification.create({
        data: {
          userId: reporter.id,
          type: rejected ? "REPORT_REJECTED" : "REPORT_APPROVED",
          title: rejected ? "Laporan ditolak" : "Laporan disetujui",
          message: rejected
            ? `Laporan "${item.name}" ditolak. Alasan: Deskripsi kurang lengkap untuk diverifikasi.`
            : `Laporan "${item.name}" telah disetujui dan aktif.`,
          createdAt: reviewedAt,
        },
      });
      await prisma.activityLog.create({
        data: {
          actorId: adminId,
          action: rejected ? "REPORT_REJECTED" : "REPORT_APPROVED",
          entity: "REPORT",
          entityId: report.id,
          metadata: JSON.stringify({ itemName: item.name, type }),
          createdAt: reviewedAt,
        },
      });
    }
    reports.push(report);
  }

  const claimable = reports.filter((r) => r.type === "FOUND" && r.status === "ACTIVE").slice(0, CLAIM_PLAN.length);

  for (let j = 0; j < claimable.length; j++) {
    const status = CLAIM_PLAN[j]!;
    const report = claimable[j]!;
    const item = SEED_ITEMS[reports.indexOf(report)]!;
    const candidates = users.filter((u) => u.id !== report.reporterId);
    const claimant = candidates[(j * 2 + 1) % candidates.length]!;
    const claimedAt = daysAgo(8 - Math.min(j, 7));
    const reviewReason =
      status === "APPROVED"
        ? "Bukti kepemilikan memadai."
        : status === "REJECTED"
          ? REJECT_REASONS[j % REJECT_REASONS.length]!
          : null;

    await prisma.claim.create({
      data: {
        reportId: report.id,
        claimantId: claimant.id,
        reason: CLAIM_REASONS[j % CLAIM_REASONS.length]!,
        evidence: `Foto kehilangan serupa tersimpan di galeri pribadi (${claimant.name}).`,
        status,
        reviewReason,
        createdAt: claimedAt,
      },
    });

    if (status !== "CANCELLED") {
      await prisma.notification.create({
        data: {
          userId: report.reporterId,
          type: "CLAIM_CREATED",
          title: "Klaim baru masuk",
          message: `Ada klaim baru untuk laporan "${item.name}".`,
          createdAt: claimedAt,
        },
      });
      await prisma.activityLog.create({
        data: {
          actorId: claimant.id,
          action: "CLAIM_CREATED",
          entity: "CLAIM",
          entityId: report.id,
          metadata: JSON.stringify({ reportId: report.id }),
          createdAt: claimedAt,
        },
      });
    }

    if (status === "APPROVED") {
      await prisma.report.update({ where: { id: report.id }, data: { status: "CLAIMED" } });
    }
    if (status === "APPROVED" || status === "REJECTED") {
      const approved = status === "APPROVED";
      const reviewedAt = daysAgo(Math.max(0, 6 - Math.min(j, 6)));
      await prisma.notification.create({
        data: {
          userId: claimant.id,
          type: approved ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
          title: approved ? "Klaim disetujui" : "Klaim ditolak",
          message: approved
            ? "Klaim Anda telah disetujui. Barang telah dihubungkan dengan laporan."
            : `Klaim Anda ditolak. Alasan: ${reviewReason}`,
          createdAt: reviewedAt,
        },
      });
      await prisma.activityLog.create({
        data: {
          actorId: adminId,
          action: approved ? "CLAIM_APPROVED" : "CLAIM_REJECTED",
          entity: "CLAIM",
          entityId: report.id,
          metadata: JSON.stringify({ reportId: report.id, ...(reviewReason ? { reviewReason } : {}) }),
          createdAt: reviewedAt,
        },
      });
    }
  }

  console.log(
    `Seed selesai: ${users.length} users, ${categories.length} categories, ${reports.length} reports, ${CLAIM_PLAN.length} claims.`,
  );
  console.log("Login: admin@example.com atau user@example.com (password: password123)");
}

if (require.main === module) {
  seed()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
