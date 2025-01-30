import { StatusCodes } from "http-status-codes";
import { createTask } from "../services/task.service.js";
import { createTaskDto, getTaskDto, updateTaskDto } from "../dtos/task.dto.js";
import {updateTask, getTask, deleteTask} from "../services/task.service.js";
import { toggleTaskCompletion } from "../services/task.service.js";
import { findTaskWithPlanner } from "../repositories/task.repository.js";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
export const handleCreateTask = async (req, res, next) => {
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 생성 API'
    #swagger.description = '할일을 생성하는 API입니다.'
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

    #swagger.responses[200] = {
        description: "할일 생성 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { 
                            type: "string", 
                            example: "SUCCESS", 
                            description: "결과 상태"
                        },
                        error: { 
                            type: "object", 
                            nullable: true, 
                            example: null, 
                            description: "에러 정보 (없을 경우 null)"
                        },
                        success: { 
                            type: "object", 
                            properties: {
                                message: { 
                                    type: "string", 
                                    example: "생성완료", 
                                    description: "성공 메시지"
                                },
                                title: { 
                                    type: "string", 
                                    example: "오늘 할일 1", 
                                    description: "생성된 할일 제목"
                                },
                                task_id: { 
                                    type: "integer", 
                                    example: 123, 
                                    description: "생성된 할일 ID"
                                },
                                is_completed: { 
                                    type: "boolean", 
                                    example: false, 
                                    description: "완료 여부"
                                },
                                created_at: { 
                                    type: "string", 
                                    format: "date-time", 
                                    example: "2025-01-01T00:00:00Z", 
                                    description: "생성 일시 (ISO 8601)"
                                },
                                updated_at: { 
                                    type: "string", 
                                    format: "date-time", 
                                    example: "2025-01-01T00:00:00Z", 
                                    description: "수정 일시 (ISO 8601)"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
*/

    try {
        // 1. req.session에서 userId 가져오기
        const userId = req.user.id;
        if (!userId) {
            throw new Error("사용자 인증이 필요합니다."); // 세션에 userId가 없으면 에러 처리
        }
        // console.log("request recevied to controller: ", req.body)
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
/*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 수정 API'
    #swagger.description = '특정 할일의 정보를 수정하는 API입니다.'
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
      #swagger.responses[200] = {
    description: "할일 수정 성공 응답",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "SUCCESS", 
                        description: "결과 상태 (SUCCESS: 성공)"
                    },
                    error: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "에러 정보 (없을 경우 null)"
                    },
                    success: { 
                        type: "object", 
                        properties: {
                            message: { 
                                type: "string", 
                                example: "수정완료", 
                                description: "성공 메시지"
                            },
                            title: { 
                                type: "string", 
                                example: "오늘 할일 1", 
                                description: "수정된 할일 제목"
                            },
                            task_id: { 
                                type: "integer", 
                                example: 123, 
                                description: "수정된 할일 ID"
                            },
                            is_completed: { 
                                type: "boolean", 
                                example: false, 
                                description: "완료 여부"
                            },
                            created_at: { 
                                type: "string", 
                                format: "date-time", 
                                example: "2025-01-01T00:00:00Z", 
                                description: "생성 일시 (ISO 8601)"
                            },
                            updated_at: { 
                                type: "string", 
                                format: "date-time", 
                                example: "2025-01-01T00:00:00Z", 
                                description: "수정 일시 (ISO 8601)"
                            }
                        }
                    }
                }
            }
        }
    }
}
#swagger.responses[400] = {
    description: "잘못된 입력 데이터",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "invalid_data", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "유효하지 않은 데이터입니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
#swagger.responses[404] = {
    description: "할일을 찾을 수 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "task_not_found", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "해당 할일을 찾을 수 없습니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
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
    if (!userId) {
        throw new Error("사용자 인증이 필요합니다."); // 로그인되지 않은 사용자 처리
    }

    // task_id 추출 및 검증
    console.log("data received to controller", req.body);
    const task_id = req.params.task_id;
    if (!task_id) {
        throw new Error("Task ID is required");
    }
    const prisma = new PrismaClient();
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


export const handleGetTask = async(req, res, next) => {
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 조회 API'
    #swagger.description = '특정 할일을 조회하는 API입니다.'
    #swagger.responses[200] = {
    description: "할일 조회 성공 응답",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "SUCCESS", 
                        description: "결과 상태 (SUCCESS: 성공)"
                    },
                    error: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "에러 정보 (없을 경우 null)"
                    },
                    success: { 
                        type: "object", 
                        properties: {
                            id: { 
                                type: "integer", 
                                description: "할일 ID", 
                                example: 123 
                            },
                            title: { 
                                type: "string", 
                                description: "할일 제목", 
                                example: "수정된 할일 제목" 
                            },
                            isCompleted: { 
                                type: "boolean", 
                                description: "완료 여부", 
                                example: false 
                            }
                        }
                    }
                }
            }
        }
    }
}
#swagger.responses[400] = {
    description: "잘못된 입력 데이터",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "invalid_data", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "유효하지 않은 데이터입니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
#swagger.responses[404] = {
    description: "할일을 찾을 수 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "task_not_found", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "해당 할일을 찾을 수 없습니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
    */
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
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 삭제 API'
    #swagger.description = '특정 할일을 삭제하는 API입니다.'
    #swagger.responses[200] = {
    description: "할일 삭제 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "SUCCESS", 
                        description: "결과 상태 (SUCCESS: 성공)"
                    },
                    error: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "에러 정보 (없을 경우 null)"
                    },
                    success: { 
                        type: "object", 
                        properties: {
                            id: { 
                                type: "integer", 
                                description: "할일 ID", 
                                example: 123 
                            },
                            title: { 
                                type: "string", 
                                description: "삭제된 할일 제목", 
                                example: "삭제된 할일 제목" 
                            },
                            isCompleted: { 
                                type: "boolean", 
                                description: "완료 여부", 
                                example: false 
                            }
                        }
                    }
                }
            }
        }
    }
}
#swagger.responses[400] = {
    description: "잘못된 입력 데이터",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "invalid_data", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "유효하지 않은 데이터입니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
#swagger.responses[404] = {
    description: "할일을 찾을 수 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "task_not_found", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "해당 할일을 찾을 수 없습니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
    */
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
        if (task.planner.userId !== BigInt(req.user.id)) {
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
    /*
    #swagger.tags = ['Tasks']
    #swagger.summary = '할일 완료여부 수정 API'
    #swagger.description = '특정 할일의 완료 여부를 수정하는 API입니다.'
    #swagger.responses[200] = {
    description: "할일 완료 여부 토글 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "SUCCESS", 
                        description: "결과 상태 (SUCCESS: 성공)"
                    },
                    error: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "에러 정보 (없을 경우 null)"
                    },
                    success: { 
                        type: "object", 
                        properties: {
                            id: { 
                                type: "integer", 
                                description: "할일 ID", 
                                example: 123 
                            },
                            title: { 
                                type: "string", 
                                description: "할일 제목", 
                                example: "수정된 할일 제목" 
                            },
                            isCompleted: { 
                                type: "boolean", 
                                description: "완료 여부", 
                                example: true 
                            }
                        }
                    }
                }
            }
        }
    }
}
#swagger.responses[400] = {
    description: "잘못된 입력 데이터",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "invalid_data", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "유효하지 않은 데이터입니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
#swagger.responses[404] = {
    description: "할일을 찾을 수 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    resultType: { 
                        type: "string", 
                        example: "FAIL", 
                        description: "결과 상태 (FAIL: 실패)"
                    },
                    error: { 
                        type: "object", 
                        nullable: false, 
                        properties: {
                            errorCode: { 
                                type: "string", 
                                example: "task_not_found", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "해당 할일을 찾을 수 없습니다.", 
                                description: "에러 사유"
                            },
                            data: { 
                                type: "object", 
                                nullable: true, 
                                description: "추가 에러 데이터",
                                example: null
                            }
                        }
                    },
                    success: { 
                        type: "object", 
                        nullable: true, 
                        example: null, 
                        description: "성공 데이터 (실패 시 null)"
                    }
                }
            }
        }
    }
}
    */
    const validTaskId = await getTaskDto(req.params.task_id);
    
    try {
        const toggledTask = await toggleTaskCompletion(validTaskId);
        res.success(toggledTask);
    }
    catch (error) {
        next(error);
    }
}