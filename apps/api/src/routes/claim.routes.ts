import { Router } from "express";
import { claimController } from "../controllers/claim.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validateId } from "../utils/validate-id";

const router = Router();
router.use(requireAuth);

router.get("/", claimController.list);
router.get("/:id", validateId(), claimController.detail);
router.patch("/:id/cancel", validateId(), claimController.cancel);

export default router;