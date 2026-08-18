import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin Kampus",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Mahasiswa Contoh",
      email: "user@example.com",
      passwordHash,
      role: "USER",
    },
  });

  const categoryNames = ["Elektronik", "Dokumen", "Pakaian", "Aksesori", "Buku", "Lainnya"];
  const categories: { id: number; name: string }[] = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  const foundCategory = categories.find((c) => c.name === "Aksesori")!;
  const lostCategory = categories.find((c) => c.name === "Elektronik")!;

  if (!(await prisma.report.findFirst({ where: { itemName: "Dompet kulit hitam" } }))) {
    await prisma.report.create({
      data: {
        reporterId: admin.id,
        categoryId: foundCategory.id,
        type: "FOUND",
        itemName: "Dompet kulit hitam",
        description: "Dompet kulit warna hitam dengan logo kecil ditemukan di perpustakaan.",
        location: "Perpustakaan Kampus",
        occurredAt: new Date(),
        status: "ACTIVE",
      },
    });
  }

  if (!(await prisma.report.findFirst({ where: { itemName: "Headphone nirkabel" } }))) {
    await prisma.report.create({
      data: {
        reporterId: user.id,
        categoryId: lostCategory.id,
        type: "LOST",
        itemName: "Headphone nirkabel",
        description: "Headphone nirkabel warna putih hilang di area kantin.",
        location: "Kantin Kampus",
        occurredAt: new Date(),
        status: "ACTIVE",
      },
    });
  }

  if (!(await prisma.report.findFirst({ where: { itemName: "Buku catatan" } }))) {
    await prisma.report.create({
      data: {
        reporterId: user.id,
        categoryId: categories.find((c) => c.name === "Buku")!.id,
        type: "LOST",
        itemName: "Buku catatan",
        description: "Buku catatan bercover biru berisi materi kuliah.",
        location: "Gedung A",
        occurredAt: new Date(),
        status: "PENDING_VERIFICATION",
      },
    });
  }

  console.log("Seed selesai: admin@example.com / user@example.com (password: password123)");
}

if (require.main === module) {
  seed()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
