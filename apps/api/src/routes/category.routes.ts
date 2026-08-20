import { Router } from "express";
import { categoryController } from "../controllers/category.controller";
import { requireAuth, requireRole } from "../middlewares/auth.middleware";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validator";
import { validate } from "../utils/validate";
import { validateId } from "../utils/validate-id";

const router = Router();

router.get("/", categoryController.list);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN"),
  validate(createCategorySchema),
  categoryController.create
);
router.patch(
  "/:id",
  requireAuth,
  requireRole("ADMIN"),
  validateId(),
  validate(updateCategorySchema),
  categoryController.update
);
router.delete("/:id", requireAuth, requireRole("ADMIN"), validateId(), categoryController.deactivate);

export default router;