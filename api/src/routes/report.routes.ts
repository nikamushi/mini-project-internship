import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { uploadImages } from "../middlewares/upload.middleware";
import { createReportSchema, updateReportSchema } from "../validators/report.validator";
import { validate } from "../utils/validate";

const router = Router();

router.get("/", reportController.list);
router.post(
  "/",
  requireAuth,
  uploadImages.array("images", 5),
  validate(createReportSchema),
  reportController.create
);
router.get("/:id", requireAuth, reportController.detail);
router.patch("/:id", requireAuth, validate(updateReportSchema), reportController.update);
router.delete("/:id", requireAuth, reportController.remove);
router.post("/:id/images", requireAuth, uploadImages.single("file"), reportController.addImage);
router.delete("/:reportId/images/:imageId", requireAuth, reportController.deleteImage);

export default router;
