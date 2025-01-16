import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";
import { handleGetTask } from "../controllers/task.controller.js";
const router = express.Router();

router.post("/", handleCreateTask);

router.patch("/:task_id", handleUpdateTask);

router.get("/:task_id", handleGetTask);
export default router;