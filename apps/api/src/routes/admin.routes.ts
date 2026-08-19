import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { claimController } from "../controllers/claim.controller";
import { dashboardController } from "../controllers/dashboard.controller";
import { reportController } from "../controllers/report.controller";
import { userController } from "../controllers/user.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";
import { reviewClaimSchema } from "../validators/claim.validator";
import { updateReportStatusSchema } from "../validators/report.validator";
import { validate } from "../utils/validate";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

router.get("/dashboard", dashboardController.get);
router.get("/activity-logs", dashboardController.activityLogs);

router.get("/users", userController.list);
router.get("/users/:id", userController.get);
router.patch("/users/:id/status", userController.setStatus);

router.get("/reports", reportController.list);
router.get("/reports/:id", reportController.detail);
router.patch(
  "/reports/:id/status",
  validate(updateReportStatusSchema),
  reportController.changeStatus
);
router.delete("/reports/:id", reportController.adminDelete);

router.get("/claims", claimController.list);
router.get("/claims/:id", claimController.detail);
router.patch("/claims/:id/status", validate(reviewClaimSchema), claimController.review);

router.get("/categories", categoryController.list);
router.post("/categories", validate(createCategorySchema), categoryController.create);
router.patch("/categories/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/categories/:id", categoryController.deactivate);

export default router;
