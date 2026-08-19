import { execSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const tmpDir = path.join(__dirname, ".tmp");
mkdirSync(tmpDir, { recursive: true });
for (const f of ["test.sqlite", "test.sqlite-journal", "test.sqlite-wal", "test.sqlite-shm"]) {
  rmSync(path.join(tmpDir, f), { force: true });
}

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = `file:${path.join(tmpDir, "test.sqlite").replace(/\\/g, "/")}`;
process.env.JWT_SECRET = "test-secret";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.UPLOAD_DIR = path.join(tmpDir, "uploads");
process.env.MAX_FILE_SIZE = "5242880";
process.env.MAX_FILES = "5";

execSync("npx prisma db push --skip-generate", { stdio: "pipe" });

(async () => {
  const { seed } = await import("../prisma/seed");
  await seed();
})();
