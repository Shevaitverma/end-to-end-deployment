import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";
import { validate } from "../middleware/validate.js";
import {
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema,
  todoIdSchema,
} from "../schemas/todo.schema.js";

const router = Router();

router.get("/", validate(todoQuerySchema), todoController.getAll);
router.get("/:id", validate(todoIdSchema), todoController.getById);
router.post("/", validate(createTodoSchema), todoController.create);
router.patch(
  "/:id",
  validate(todoIdSchema.merge(updateTodoSchema)),
  todoController.update
);
router.delete("/:id", validate(todoIdSchema), todoController.delete);

export default router;
