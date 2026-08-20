import { Router } from "express";
import { claimController } from "../controllers/claim.controller";
import { reportController } from "../controllers/report.controller";
import { optionalAuth, requireAuth } from "../middlewares/auth.middleware";
import { uploadImages } from "../middlewares/upload.middleware";
import { createClaimSchema } from "../validators/claim.validator";
import { createReportSchema, updateReportSchema } from "../validators/report.validator";
import { validate } from "../utils/validate";
import { validateId } from "../utils/validate-id";

const router = Router();

router.get("/", optionalAuth, reportController.list);
router.post(
  "/",
  requireAuth,
  uploadImages.array("images", 5),
  validate(createReportSchema),
  reportController.create
);
router.get("/:id", requireAuth, validateId(), reportController.detail);
router.patch("/:id", requireAuth, validateId(), validate(updateReportSchema), reportController.update);
router.delete("/:id", requireAuth, validateId(), reportController.remove);
router.post(
  "/:id/images",
  requireAuth,
  validateId(),
  uploadImages.single("file"),
  reportController.addImage
);
router.delete(
  "/:reportId/images/:imageId",
  requireAuth,
  validateId("reportId"),
  validateId("imageId"),
  reportController.deleteImage
);
router.post(
  "/:reportId/claims",
  requireAuth,
  validateId("reportId"),
  validate(createClaimSchema),
  claimController.create
);

export default router;