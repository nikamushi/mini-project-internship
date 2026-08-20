import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateId } from "../utils/validate-id";

const router = Router();

router.get("/", requireAuth, notificationController.list);
router.patch("/read-all", requireAuth, notificationController.markAllRead);
router.patch("/:id/read", requireAuth, validateId(), notificationController.markRead);

export default router;