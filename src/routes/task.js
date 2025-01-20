import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";
import { handleGetTask, handleDeleteTask, handleToggleCompletion } from "../controllers/task.controller.js";
const router = express.Router();
/**
 * @swagger
 * /:
 *   post:
 *     summary: 할일 새로 생성성
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 할일 제목 
 *               
 *               planner_date:
 *                 type: string
 *                 description: 날짜 
 *             required:
 *               - title
 *               - planner_date
 *     responses:
 *       201:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 plannerId:
 *                   type: integer
 *       400:
 *         description: Invalid input data
 */
router.post("/", handleCreateTask);

/**
 * @swagger
 * /{task_id}:
 *   patch:
 *     summary: 할일 수정하기 
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the task
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 isCompleted:
 *                   type: boolean
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Task not found
 */
router.patch("/:task_id", handleUpdateTask);

router.get("/:task_id", handleGetTask);

router.delete("/:task_id", handleDeleteTask);

//할일 완료여부 수정 
router.patch("/:task_id/status", handleToggleCompletion);
export default router;