import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const backendDir = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const dbFile = resolve(backendDir, "data", "database.sqlite");
for (const suffix of ["", "-journal", "-wal", "-shm"]) {
  const f = dbFile + suffix;
  if (existsSync(f)) rmSync(f);
}

execSync("npx prisma migrate deploy", { cwd: backendDir, stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { cwd: backendDir, stdio: "inherit" });
console.log("Database siap.");