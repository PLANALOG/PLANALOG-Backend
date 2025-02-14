import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";
import { handleGetTask, handleDeleteTask, handleToggleCompletion, handleCreateTaskBulk } from "../controllers/task.controller.js";
const router = express.Router();

router.post("/", handleCreateTask);
router.post("/bulk", handleCreateTaskBulk);

router.patch("/:task_id", handleUpdateTask);

//할일 조회
router.get("/", handleGetTask);

// router.delete("/:task_id", handleDeleteTask);
router.delete("/", handleDeleteTask);
 
router.patch("/:task_id/status", handleToggleCompletion);
export default router;