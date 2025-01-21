import { StatusCodes } from "http-status-codes";
import { createTask } from "../services/task.service.js";
import { createTaskDto, getTaskDto, updateTaskDto } from "../dtos/task.dto.js";
import {updateTask, getTask, deleteTask} from "../services/task.service.js";
import { toggleTaskCompletion } from "../services/task.service.js";
import { findTaskWithPlanner } from "../repositories/task.repository.js";
export const handleCreateTask = async (req, res, next) => {
    try {
        // console.log("request recevied to controller: ", req.body)
        // 1단계: 요청 검사
        // 요청 데이터 검증 (DTO에서 수행)
        const validTaskData = createTaskDto(req.body);
        // 요청을 확인!
        // console.log("data validated from dto validTaskData", validTaskData);
        // 검증된 데이터를 Service에 전달
        // 서비스 계층 호출 
        const newTask = await createTask(validTaskData);

        // 성공 응답 반환
        res.success(newTask);

    } catch (error) {
        next(error);
    }
}

export const handleUpdateTask = async (req, res, next ) => {
    try {
        // task_id 추출 및 검증
        console.log("data received to controller", req.body);
        const task_id = req.params.task_id;
        if (!task_id) {
            throw new Error("Task ID is required");
        }

        const validData = await updateTaskDto(task_id, req.body);

        console.log("data after dto",validData);

        const updatedTask = await updateTask(validData);

        res.success(updatedTask);

    }
    catch (error) {
        next(error);
    }
}

export const handleGetTask = async(req, res, next) => {
    //Task 조회. 
    const task_id = req.params.task_id;

    const validTaskId = getTaskDto(task_id);
    
    try {
        const task = await getTask(validTaskId);

        res.success(task)
    }
    catch (error) {
        next(error);
    }
}

export const handleDeleteTask = async(req, res, next) => {
    
    try {
        const taskId = req.params.task_id;

        // Validate task_id
        if (!taskId || isNaN(taskId)) {
            return res.status(400).json({
                resultType: "FAIL",
                error: {
                    errorCode: "invalid_task_id",
                    reason: "task_id must be a valid number.",
                },
                success: null,
            });
        }

        // Task 조회
        const task = await findTaskWithPlanner({"task_id": taskId});

        // Task가 존재하지 않으면 에러
        if (!task) {
            return res.status(404).json({
                resultType: "FAIL",
                error: {
                    errorCode: "task_not_found",
                    reason: "Task not found.",
                },
                success: null,
            });
        }

        // 권한 검증
        if (task.planner.user_id !== BigInt(req.user.id)) {
            throw new Error("Unauthorized: You cannot delete this task.");
        }


        const validTaskId = getTaskDto(req.params.task_id);
        // Task 삭제
        const deletedTask = await deleteTask(validTaskId);
        
        res.success(deletedTask);
    } catch (error) {
        next(error);
        }
    }

    // const validTaskId = await getTaskDto(req.params.task_id);
    // try {
    //     const deletedtask = await deleteTask(validTaskId);
        
    //     res.success(deletedtask);
    // }
    // catch (error) {
    //     next(error);
    // }


export const handleToggleCompletion = async(req, res, next) => {

    const validTaskId = await getTaskDto(req.params.task_id);
    
    try {
        const toggledTask = await toggleTaskCompletion(validTaskId);
        res.success(toggledTask);
    }
    catch (error) {
        next(error);
    }
}