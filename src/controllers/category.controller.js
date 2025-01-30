import {
    createCategory,
    updateCategory,
    getCategoriesByUser,
    deleteCategory
} from '../services/category.service.js'

// 카테고리 생성
export const handleCreateCategory = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 생성 API'
    #swagger.requestBody = {
    required: true,
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    name: { 
                        type: "string", 
                        example: "Work", 
                        description: "카테고리 이름" 
                    }
                },
                required: ["name"]
            }
        }
    }
}
#swagger.responses[200] = {
    description: "카테고리 생성 성공",
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
                                description: "카테고리 ID", 
                                example: 1 
                            },
                            name: { 
                                type: "string", 
                                description: "생성된 카테고리 이름", 
                                example: "Work" 
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
    */
    try {
        //세션에서 userId 가져오기 
        const userId = req.user.id;
        const name = req.body.name;
        console.log("Data received to controller(userId, name):", userId, name);

        // userId 있는지 확인 
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const createdTaskCategory = await createCategory({ userId, name }); // 서비스 호출
        res.success(createdTaskCategory); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};


// 카테고리 수정
export const handleUpdateCategory = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 수정 API'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        name: { 
                            type: "string", 
                            example: "Personal", 
                            description: "수정할 카테고리 이름" 
                        }
                    },
                    required: ["name"]
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "카테고리 수정 성공",
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
                                    description: "카테고리 ID", 
                                    example: 1 
                                },
                                name: { 
                                    type: "string", 
                                    description: "수정된 카테고리 이름", 
                                    example: "Personal" 
                                }
                            }
                        }
                    }
                }
            }
        }
    */
    try {
        const { task_categories_id } = req.params; // URL에서 ID 추출
        const { name } = req.body; // 요청 본문에서 새로운 카테고리 이름 추출

        if (!name) {
            return res.error({
                errorCode: "INVALID_INPUT",
                reason: "Category name is required",
            });
        }

        const updatedTaskCategory = await updateCategory(task_categories_id, name); // 서비스 호출
        res.success(updatedTaskCategory); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 유저별 카테고리 조회
export const handleViewCategory = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 조회 API'
    #swagger.responses[200] = {
    description: "카테고리 조회 성공",
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
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { 
                                    type: "integer", 
                                    description: "카테고리 ID", 
                                    example: 1 
                                },
                                name: { 
                                    type: "string", 
                                    description: "카테고리 이름", 
                                    example: "Work" 
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
    try {
        const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID

        if (!userId) {
            return res.error({
                errorCode: "UNAUTHORIZED",
                reason: "User ID is missing",
            });
        }

        const taskCategories = await getCategoriesByUser(userId); // 서비스 호출
        res.success(taskCategories); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 카테고리 삭제
export const handleDeleteCategory = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 생성 API'
    #swagger.responses[200] = {
    description: "카테고리 삭제 성공",
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
                                description: "삭제된 카테고리 ID", 
                                example: 1 
                            },
                            name: { 
                                type: "string", 
                                description: "삭제된 카테고리 이름", 
                                example: "Work" 
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
                                example: "카테고리 ID가 유효하지 않습니다.", 
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
    description: "카테고리를 찾을 수 없음",
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
                                example: "category_not_found", 
                                description: "에러 코드"
                            },
                            reason: { 
                                type: "string", 
                                example: "해당 카테고리를 찾을 수 없습니다.", 
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
        const { task_categories_id } = req.params; // Extract ID from URL

        if (!task_categories_id) {
            return res.error({
                errorCode: "INVALID_INPUT",
                reason: "Task category ID is required",
            });
        }

        await deleteCategory(task_categories_id); // Call service to delete category

        res.success({ message: "Task category deleted successfully" }); // Respond with success
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};