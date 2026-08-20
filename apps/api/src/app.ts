import { randomUUID } from "node:crypto";
import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import claimRoutes from "./routes/claim.routes";
import notificationRoutes from "./routes/notification.routes";
import reportRoutes from "./routes/report.routes";

export function createApp(): express.Express {
  const app = express();

  app.set("trust proxy", 1);

  app.use((req, res, next) => {
    res.setHeader("X-Request-ID", randomUUID());
    next();
  });
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin.split(",").map((o) => o.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  if (env.nodeEnv !== "test") {
    app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  }

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.nodeEnv === "test" ? 1000 : 20,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const mutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.nodeEnv === "test" ? 1000 : 30,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const mutationOnly = (limiter: ReturnType<typeof rateLimit>) =>
    (req: Request, res: Response, next: NextFunction) => {
      if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
      return limiter(req, res, next);
    };

  app.use("/api/auth/register", authLimiter);
  app.use("/api/auth/login", authLimiter);
  app.use("/api/reports", mutationOnly(mutationLimiter));
  app.use("/api/reports/:reportId/claims", mutationOnly(mutationLimiter));
  app.use(
    "/uploads",
    express.static(path.join(env.uploadDir), { dotfiles: "deny", fallthrough: true })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/claims", claimRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
