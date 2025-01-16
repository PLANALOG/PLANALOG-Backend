import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";

const router = express.Router();

router.post("/", handleCreateTask);

router.patch("/:task_id", handleUpdateTask);

export default router;