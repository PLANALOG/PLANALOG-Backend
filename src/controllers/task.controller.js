import { StatusCodes } from "http-status-codes";
import { createTask } from "../services/task.service.js";
import { createTaskDto } from "../dtos/task.dto.js";

export const handleCreateTask = async (req,res,next) => {
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
        
    }
}