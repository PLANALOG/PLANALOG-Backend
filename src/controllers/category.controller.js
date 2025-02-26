import {createCategoryService,
        updateCategoryService,
        getCategoriesByUser,
        deleteCategoryService,
        createTaskCategory,
        createTaskCategoryBulk,
        createCategoryBulk
} from '../services/category.service.js';
import { transformCategoryListResponse,
        transformCategoryResponse,
        transformTaskResponse,
        transformTaskListResponse
 } from '../dtos/task.dto.js';
import { createTaskBulkDto, createTaskDto } from '../dtos/task.dto.js';
import { deleteCategoryRepository } from '../repositories/category.repository.js';
import { DuplicateCategoryError, AuthError } from '../errors.js';
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
                                example: "과제", 
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
        if (!req.user || !userId) {
            throw new AuthError;
        }

        // 생성된 카테고리 반환 
        const createdCategory = await createCategoryService({ userId, name }); // 서비스 호출

        res.success(
            transformCategoryResponse(createdCategory)
        ); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 카테고리 한번에 여러개 생성
export const handleCreateCategoryBulk = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 다중 생성 API'
    #swagger.description = '여러 카테고리들을을 한 번에 생성하는 API입니다.'
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
                        names: {
                            type: "array",
                            description: "카테고리 리스트",
                            example: ["운동", "공부", "알바"]
                        }
                    }
                }
            }
        }
    }
    */
   try {
        // 인증 미들웨어에서 설정된 사용자 ID
        const userId = req.user.id; 
        const names = req.body.names;
        
        
        // userId 있는지 확인 
        if (!req.user || !userId) {
            throw new AuthError;
        }

         
        const createdCategories = await createCategoryBulk({ userId, names }); // 서비스 호출
        // 성공 응답
        res.success(transformCategoryListResponse(createdCategories)); 
   } catch (error) {
       next(error); 
   }
}
// 카테고리 수정
export const handleUpdateCategory = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '카테고리 수정 API'
    #swagger.description = '카테고리를 수정하는 API입니다.'
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
                            example: "기타 업무", 
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
        const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID   

        if (!req.user || !userId) {
            throw new AuthError;
        }

        const { task_category_id } = req.params; // URL에서 ID 추출
        const { name } = req.body; // 요청 본문에서 새로운 카테고리 이름 추출
        console.log("Data received to controller(task_category_id, name):", task_category_id, name);    
        if (!name) {
            return res.error({
                errorCode: "INVALID_INPUT",
                reason: "카테고리 이름이 필요합니다다",
            });
        }

        const updatedCategory = await updateCategoryService(task_category_id, name, userId); // 서비스 호출
        res.success(transformCategoryResponse(updatedCategory)); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 유저별 카테고리 조회
export const handleViewCategory = async (req, res, next) => {
    /*
        #swagger.tags = ['Categories']
        #swagger.summary = '카테고리 조회 API'
        #swagger.description = '유저별 카테고리를 조회하는 API입니다.'
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

        if (!req.user || !userId) {
            throw new AuthError;
        }


        const taskCategories = await getCategoriesByUser(userId); // 서비스 호출
        res.success(transformCategoryListResponse(taskCategories)); // 성공 응답
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
    const userId = req.user.id; // 인증 미들웨어에서 설정된 사용자 ID
    if (!req.user || !userId) {
        throw new AuthError;
    }

    if (!req.user || !userId) {
        throw new AuthError;
    }

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.error({
            errorCode: "INVALID_INPUT",
            reason: "Category ID는 배열형태이어야합니다다",
        });
    }

    
    const result = await deleteCategoryService(categoryIds, userId); // 서비스 호출

    // 성공 응답
    res.success({ 
        message: "할일 카테고리가 삭제되었습니다. ",
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
        #swagger.description = '해당 카테고리에 해당하는 할일을 생성하는 API입니다.'
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
        if (!req.user || !userId) {
            throw new AuthError;
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

// 카테고리형 유저 할일 다중생성 
export const handleCreateTaskCategoryBulk = async (req, res, next) => {
    /*
    #swagger.tags = ['Categories']
    #swagger.summary = '해당카테고리에 해당하는 할일 다중 생성 api'
    #swagger.description = '해당 카테고리에 해당하는 할일들을 한 번에 여러 개 생성하는 API입니다.'
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
                            example: ["해야할일 1","해야할일 2","해야할일 3"],
                            items: {type:"string"}, 
                            description: "할일 제목들 배열" 
                        },
                        planner_date: { 
                            type: "string", 
                            format: "date",
                            example: "2022-12-25", 
                            description: "할일 계획 날짜" 
                        }
                    },
                    required: ["titles", "planner_date"]
                }
            }
        }
    }
    
    */
    try {
        // URL에서 ID 추출
        const { task_category_id } = req.params; 
        // 요청 본문에서 할일 데이터 추출
        const taskData = createTaskBulkDto(req.body);
        console.log("taskData", taskData);  
        // ✅ 사용자 ID 가져오기
        const userId = req.user.id; 
        if (!req.user || !userId) {
            throw new AuthError;
        }

        const createdTaskCategory = await createTaskCategoryBulk({
            taskData,
            task_category_id,
            userId
        });
        return res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: transformTaskResponse(createdTaskCategory),
        });
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
}