import { Router } from "express";
import { claimController } from "../controllers/claim.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { createClaimSchema } from "../validators/claim.validator";
import { validate } from "../utils/validate";

const router = Router();

router.post(
  "/reports/:reportId/claims",
  requireAuth,
  validate(createClaimSchema),
  claimController.create
);
router.get("/claims", requireAuth, claimController.list);
router.get("/claims/:id", requireAuth, claimController.detail);
router.patch("/claims/:id/cancel", requireAuth, claimController.cancel);

export default router;
