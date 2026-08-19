import "dotenv/config";

const required = ["DATABASE_URL", "JWT_SECRET"] as const;

function readString(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function readInt(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} wajib diisi. Lihat .env.example`);
  }
}

export const env = {
  nodeEnv: readString("NODE_ENV", "development"),
  port: readInt("PORT", 3000),
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: readString("JWT_EXPIRES_IN", "7d"),
  corsOrigin: readString("CORS_ORIGIN", "http://localhost:5173"),
  uploadDir: readString("UPLOAD_DIR", "./uploads"),
  maxFileSize: readInt("MAX_FILE_SIZE", 5 * 1024 * 1024),
  maxFiles: readInt("MAX_FILES", 5),
};
