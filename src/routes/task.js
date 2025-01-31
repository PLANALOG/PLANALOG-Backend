import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";
import { handleGetTask, handleDeleteTask, handleToggleCompletion } from "../controllers/task.controller.js";
const router = express.Router();

router.post("/", handleCreateTask);

router.patch("/:task_id", handleUpdateTask);

router.get("/:task_id", handleGetTask);

// router.delete("/:task_id", handleDeleteTask);
router.delete("/", handleDeleteTask);
 
router.patch("/:task_id/status", handleToggleCompletion);
export default router;