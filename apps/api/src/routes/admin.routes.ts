import { Router } from "express";
import { claimController } from "../controllers/claim.controller";
import { dashboardController } from "../controllers/dashboard.controller";
import { reportController } from "../controllers/report.controller";
import { userController } from "../controllers/user.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { reviewClaimSchema } from "../validators/claim.validator";
import { updateReportStatusSchema } from "../validators/report.validator";
import { validate } from "../utils/validate";
import { validateId } from "../utils/validate-id";

const router = Router();
router.use(requireAuth, requireRole("ADMIN"));

router.get("/dashboard", dashboardController.get);
router.get("/activity-logs", dashboardController.activityLogs);

router.get("/users", userController.list);
router.get("/users/:id", validateId(), userController.get);
router.patch("/users/:id/status", validateId(), userController.setStatus);

router.get("/reports", reportController.list);
router.get("/reports/:id", validateId(), reportController.detail);
router.patch(
  "/reports/:id/status",
  validateId(),
  validate(updateReportStatusSchema),
  reportController.changeStatus
);
router.delete("/reports/:id", validateId(), reportController.adminDelete);

router.get("/claims", claimController.list);
router.get("/claims/:id", validateId(), claimController.detail);
router.patch(
  "/claims/:id/status",
  validateId(),
  validate(reviewClaimSchema),
  claimController.review
);

export default router;