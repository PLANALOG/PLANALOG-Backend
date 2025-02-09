import {createCategory,
        updateCategory,
        getCategoriesByUser,
        deleteCategoryService,
        createTaskCategory
} from '../services/category.service.js'
import { createTaskDto } from '../dtos/task.dto.js';
import { deleteCategoryRepository } from '../repositories/category.repository.js';
// 카테고리 생성
export const handleCreateCategory = async (req, res, next) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = '카테고리 생성 API'
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
    */
    try {
        const { task_category_id } = req.params; // URL에서 ID 추출
        const { name } = req.body; // 요청 본문에서 새로운 카테고리 이름 추출

        if (!name) {
            return res.error({
                errorCode: "INVALID_INPUT",
                reason: "Category name is required",
            });
        }

        const updatedTaskCategory = await updateCategory(task_category_id, name); // 서비스 호출
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
        #swagger.security = [{
        "bearerAuth": []
        }]
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
    #swagger.summary = '카테고리 삭제 API'
    #swagger.description = '배열 형태의 카테고리 ID 목록을 입력받아 한 번에 여러 개의 카테고리를 삭제합니다.'
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
                        categoryIds: { 
                            type: "array", 
                            items: { type: "integer" },
                            description: "삭제할 카테고리 ID 목록",
                            example: [1, 2, 3]
                        }
                    },
                    required: ["categoryIds"]
                }
            }
        }
    }
    */
try {
    // 삭제할 카테고리 배열 전달받기 
    const { categoryIds } = req.body; 

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.error({
            errorCode: "INVALID_INPUT",
            reason: "Category IDs must be a non-empty array",
        });
    }

    
    const result = await deleteCategoryService(categoryIds, req.user.id); // 서비스 호출

    // 성공 응답
    res.success({ 
        message: "Task categories deleted successfully",
        count: result.count, // 삭제된 레코드 수
    });
} catch (error) {
    next(error);
}
}

export const handleCreateTaskCategory = async (req, res, next) => { 
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = '카테고리형 유저 할일 생성 API'
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
                                example: "해야할일 123", 
                                description: "할일 제목" 
                            },
                            planner_date: { 
                                type: "string", 
                                example: "2022-12-25", 
                                description: "할일 계획 날짜" 
                            }
                        },
                        required: ["title", "planner_date"]
                    }
                }
            }
        }
        */
    try {
        // URL에서 ID 추출
        const { task_category_id } = req.params; 
        const taskData = createTaskDto(req.body);     
        // ✅ 사용자 ID 가져오기   
        const userId = req.user.id; 
        if (!userId) {
                return res.status(400).json({
                    resultType: "FAIL",
                    error: {
                        errorCode: "USER_NOT_FOUND",
                        reason: "사용자 인증이 필요합니다.",
                    },
                    success: null,
                });
            }
        const createdTaskCategory = await createTaskCategory({
            ...taskData, // 자바스크립트 스프레드 문법으로 객체 병합
            task_category_id,
            userId
        });
        return res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: createdTaskCategory,
        });
        }
        catch (error) {
            next(error); // 전역 오류 처리 미들웨어로 전달
        }
    } 