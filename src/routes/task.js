import express from "express";
import { handleCreateTask } from "../controllers/task.controller.js";
import { handleUpdateTask } from "../controllers/task.controller.js";
import { handleGetTask, handleDeleteTask, handleToggleCompletion } from "../controllers/task.controller.js";
const router = express.Router();
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
                                title: { npm 
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
    }

*/
router.post("/", handleCreateTask);

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
router.patch("/:task_id", handleUpdateTask);
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
router.get("/:task_id", handleGetTask);
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
router.delete("/:task_id", handleDeleteTask);

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
router.patch("/:task_id/status", handleToggleCompletion);
export default router;