import { StatusCodes } from "http-status-codes";
import { createTask,createTaskBulk} from "../services/task.service.js";
import { createTaskBulkDto, createTaskDto, getTaskDto, responseFromToggledTask, updateTaskDto } from "../dtos/task.dto.js";
import { updateTask, getTask, deleteTask } from "../services/task.service.js";
import { toggleTaskCompletion } from "../services/task.service.js";
import { findTaskWithPlanner } from "../repositories/task.repository.js";
import { prisma } from "../db.config.js";
import { AuthError } from "../errors.js";
export const handleCreateTask = async (req, res, next) => {
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 생성 API'
    #swagger.description = '할일을 생성하는 API입니다.'
    #swagger.security = [{
        "bearerAuth": []
        }]
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: { 
                            type: "string", 
                            example: "오늘 할일 1", 
                            description: "할일 제목"
                        },
                        planner_date: { 
                            type: "string", 
                            format: "date", 
                            example: "2025-01-10", 
                            description: "할일 일정 날짜 (YYYY-MM-DD)"
                        }
                    },
                    required: ["title", "planner_date"]
                }
            }
        }
    }
*/
    try {
        // 1. req.session에서 userId 가져오기
        const userId = req.user.id;
        if (!req.user || !userId) {
            throw new AuthError;
        }

        console.log("userId from session", userId);
        // console.log("request recevied to controller: ", req.body)
        // 요청 데이터 검증 (DTO에서 수행)
        const validTaskData = createTaskDto(req.body);
        // 요청을 확인!
        // console.log("data validated from dto validTaskData", validTaskData);
        // 검증된 데이터를 Service에 전달
        // 서비스 계층 호출 
        const newTask = await createTask({ ...validTaskData, userId });

        // 성공 응답 반환
        res.success(newTask);

    } catch (error) {
        next(error);
    }
}

export const handleCreateTaskBulk = async (req, res, next) => {
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 다중 생성 API'
    #swagger.description = '여러 할일을 한 번에 생성하는 API입니다.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        titles: {
                            type: "array",
                            description: "할일 제목 리스트",
                            example: ["오늘 할일 1", "오늘 할일 2", "오늘 할일 3"]
                        },
                        planner_date: {
                            type: "string",
                            format: "date",
                            description: "할일 일정 날짜 (YYYY-MM-DD)",
                            example: "2025-01-10"
                        }
                    }
                }
            }
        }
    }
    */
   try {
        const userId = req.user.id;
        if (!req.user || !userId) {
                throw new AuthError;
        }
        
        console.log("request body", req.body);
        //dto로 검증 
        const validTaskData = await createTaskBulkDto(req.body);
        
        console.log(validTaskData);
        //여러개 생성 
        const newTasks= await createTaskBulk (validTaskData, userId);

        res.success(newTasks);
   } catch (error) {
        next(error);
   }

}
export const handleUpdateTask = async (req, res, next) => {
    /*
        #swagger.tags = ['Tasks']
        #swagger.summary = '할일 수정 API'
        #swagger.description = '특정 할일의 정보를 수정하는 API입니다.'
        #swagger.security = [{
            "bearerAuth": []
            }]
        #swagger.requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                   title: {
                      type: "string",
                      description: "수정할 할일 제목",
                      example: "수정된 할일 제목"
                    }
                  }
                }
              }
            }
          }
        */

    try {
        // userId 가져오기
        const userId = req.user.id; // 세션에서 userId 추출
        if (!req.user || !userId) {
                    throw new AuthError;
                }
        
        console.log("handleUpdateTask입니다");
        // task_id 추출 및 검증
        console.log("data received to controller", req.body);
        const task_id = req.params.task_id;
        if (!task_id) {
            throw new Error("Task ID is required");
        }
        // Task가 사용자의 Task인지 검증
        const task = await prisma.task.findFirst({
            where: {
                id: parseInt(task_id), // Task ID
                planner: {
                    userId: userId, // 해당 사용자의 플래너인지 확인
                },
            },
        });

        if (!task) {
            throw new Error("해당 할일이 존재하지 않거나 수정 권한이 없습니다.");
        }

        // 유효한 데이터 검증 (DTO 활용)
        const validData = await updateTaskDto(task_id, req.body);

        console.log("data after dto", validData.task_id, validData.title);

        // Task 업데이트
        const updatedTask = await prisma.task.update({
            where: { id: parseInt(task_id) },
            data: {
                title: validData.title, // 새로운 제목
            },
        });

        // 성공 응답
        res.success(updatedTask);
    } catch (error) {
        next(error);
    }
};


export const handleGetTask = async (req, res, next) => {
    /*
        #swagger.tags = ['Tasks']
        #swagger.summary = '할일 조회 API'
        #swagger.description = '날짜별로 (플래너별로) 할일들을 모두 조회하는 api 입니다다.'
        #swagger.security = [{
        "bearerAuth": []
        }]
        #swagger.parameters = [
            {
            "name": "planner_date",
            "in": "query",
            "required": true,
            "type": "string",
            "format": "date",
            "description": "조회할 날짜 (YYYY-MM-DD 형식)"
            }
        ]
    */
    //Task 조회. 

    
    const userId = req.user.id;
    const planner_date = req.query.planner_date;
    try {
        const validDate = getTaskDto(planner_date); 
        console.log("validDate after dto", validDate);

        
        const tasks = await getTask(validDate, userId);
        
        res.success(tasks);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

export const handleDeleteTask = async (req, res, next) => {
    /*
        #swagger.tags = ['Tasks']
        #swagger.summary = '할일 삭제 API'
        #swagger.description = '특정 할일(들)을 삭제하는 API입니다.'
        #swagger.security = [{
        "bearerAuth": []
        }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ids: { 
                                type: "array", 
                                items: { type: "integer" }, 
                                example: [123, 456],
                                description: "삭제할 할일 ID 리스트"
                            }
                        },
                        required: ["ids"]
                    }
                }
            }
        }
*/
    try {
        // 요청 데이터에서 ids 추출
        const userId = req.user.id; 
        const { ids } = req.body;
        if (!req.user || !userId) {
            throw new AuthError;
                }
        
        console.log("전달받은 id들:", ids);
        // 유효성 검사
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                resultType: "FAIL",
                error: {
                    errorCode: "INVALID_INPUT",
                    reason: "ids는 배열 형태여야 하며 최소 하나의 ID를 포함해야 합니다.",
                },
                success: null,
            });
        }

        // Service 호출
        const deletedTasks = await deleteTask(ids, req.user.id);

        return res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: { deletedTasks }, // ✅ 삭제된 항목 반환
        });
    } catch (error) {
        next(error);
    }
};


export const handleToggleCompletion = async (req, res, next) => {
    /*
     #swagger.tags = ['Tasks']
     #swagger.summary = '할일 완료여부 수정 API'
     #swagger.description = '특정 할일들의 완료여부를 수정하는 API 입니다.'
     #swagger.security = [{
         "bearerAuth": []
         }]
     #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            ids: { 
                                type: "array", 
                                items: { type: "integer" }, 
                                example: [3, 4, 5],
                                description: "완료여부 수정할 할일 ID 리스트"
                            }
                        },
                        required: ["ids"]
                    }
                }
            }
        }
     */
    // Task ID 추출
    
    const ids = req.body.ids; 
    const userId = req.user.id;
    if (!req.user || !userId) {
        throw new AuthError;
    }
   
    console.log(ids);

    try {
        // 배열 전달 
        const { toggledTasks, newPlannerIsCompleted } = await toggleTaskCompletion(ids, userId);
        console.log("newPlannerIsCompleted",newPlannerIsCompleted);
        res.success(responseFromToggledTask(toggledTasks, newPlannerIsCompleted ));
    }
    catch (error) {
        next(error);
    }
}