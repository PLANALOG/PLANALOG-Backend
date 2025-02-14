import {
    createCategoryRepository,
    updateCategoryRepository,
    getAllCategoriesRepository,
    deleteCategoryRepository,
    createTaskCategoryRepository,
    getCategoryById
} from "../repositories/category.repository.js";

import { DuplicateCategoryError, NoExistsCategoryError, UnauthorizedCategoryAccessError, InvalidCategoryIdError } from "../errors.js";

import {prisma} from "../db.config.js";
import { addTask } from "../repositories/task.repository.js";
import { isDeletedUser } from "../repositories/user.repository.js";


export const createCategoryService = async ({ userId, name }) => {
    
    //카테고리 생성
    try {
        await isDeletedUser(userId);
        // 리포지토리 호출
        const createdCategory = await createCategoryRepository({ userId, name });
        return createdCategory;
    } catch (error) {
        throw error;
    }
};
// 카테고리 여러개 생성
export const createCategoryBulk = async ({userId, names}) => {
    
    const success = [];
    const failed = [];

    try {
        await isDeletedUser(userId);
        // Promise.allSettled()을 사용하여 모든 요청을 병렬로 실행 (중간에 에러가 발생해도 나머지 실행됨)
        const results = await Promise.allSettled(
            names.map(async (name) => {
                try {
                    return await createCategoryRepository({ userId, name });
                } catch (error) {
                    throw error;
                }
            })
        );

        // 생성 결과를 success / failed 리스트로 분류
        results.forEach((result, index) => {
            const name = names[index];

            if (result.status === "fulfilled") {
                success.push(result.value);
            } else {
                const error = result.reason;
                if (error instanceof DuplicateCategoryError) {
                    failed.push({ name, reason: "중복된 카테고리" });
                } else {
                    failed.push({ name, reason: error.message || "알 수 없는 오류" });
                }
            }
        });

        // 모든 요청이 실패한 경우에도 정상 응답을 반환 (throw error 하지 않음)
        if (success.length === 0) {
            return {
                resultType: "FAIL",
                error: {
                    errorCode: "CATEGORY_CREATION_FAILED",
                    reason: "모든 카테고리 생성이 실패했습니다.",
                    data: failed
                },
                data: null
            };
        }

        // 일부 성공한 경우
        return {
            resultType: failed.length > 0 ? "PARTIAL_SUCCESS" : "SUCCESS",
            error: failed.length > 0 ? { errorCode: "PARTIAL_FAILURE", data: failed } : null,
            data: { success, failed }
        };

    } catch (error) {
        return {
            resultType: "FAIL",
            error: {
                errorCode: "UNKNOWN_ERROR",
                reason: "알 수 없는 서버 오류가 발생했습니다.",
                data: error.message
            },
            data: null
        };
    }
};
// 카테고리 수정
export const updateCategoryService = async (task_category_id, name, userId) => {
    
    try {
        await isDeletedUser(userId);
        const category = await getCategoryById(task_category_id);
        // 2️⃣ 카테고리가 존재하지 않으면 예외 발생 (CA004)
        if (!category) {
            throw new NoExistsCategoryError({ categoryId: task_category_id });
        }

        // 3️⃣ userId가 일치하지 않으면 접근 권한 없음 (CA005)
        if (category.userId !== BigInt(userId)) {
            throw new UnauthorizedCategoryAccessError({ categoryId: task_category_id, userId });
        }
        const updatedCategory = await updateCategoryRepository(task_category_id, name); // 리포지토리 호출
        
        return updatedCategory;
    } catch (error) {
        throw error;
    }
}; 

// 유저별 카테고리 조회
export const getCategoriesByUser = async (userId) => {
    
    try {
        await isDeletedUser(userId);
        const viewedCategories = await getAllCategoriesRepository(userId); // 리포지토리 호출
        if (!viewedCategories || viewedCategories.length === 0) {
            throw new Error("유저에 해당되는 카테고리가 없습니다.");
        }
        return viewedCategories;
    } catch (error) {
        throw error;
    }
};

export const deleteCategoryService = async (categoryIds, userId) => {
    
    try {
        await isDeletedUser(userId);
        // 1️⃣ 삭제 대상 카테고리 조회
        const categoriesToDelete = await prisma.taskCategory.findMany({
            where: { id: { in: categoryIds} }, 
            select: {id: true, userId: true}
        });

        if (categoriesToDelete.length === 0) {
            throw new NoExistsCategoryError({ categoryIds });
        }

        // 2️⃣ 사용자 권한 검증
        const unauthorizedCategories = categoriesToDelete.filter(
            (category) => category.userId !== BigInt(userId)
        );

        if (unauthorizedCategories.length > 0) {
            throw new UnauthorizedCategoryAccessError({ categoryIds: unauthorizedCategories.map((category) => category.id) });
        }

        // 3️⃣ 삭제 실행
        const deletedCategories = await deleteCategoryRepository(categoryIds);
        
        return deletedCategories; // 삭제된 항목 반환
    } catch (error) {
        throw error;
    }
};
export const createTaskCategory = async ({ task_category_id, title, planner_date, userId }) => {
    await isDeletedUser(userId);
    // 서비스 로직: 예외 처리, 비즈니스 로직 추가
    if (!task_category_id || isNaN(task_category_id)) {
        throw new InvalidCategoryIdError();
    }
    
    
    const category = await prisma.taskCategory.findUnique({
        where: {
            id: BigInt(task_category_id),
        },
    });
    if (category==null) {
        throw new NoExistsCategoryError({ categoryId: task_category_id });  
    }
    // task_category가 본인것인지 확인. 
    if (category.userId !== BigInt(userId)) {
        throw new UnauthorizedCategoryAccessError({ categoryId: task_category_id, userId });
    };
    
    
    // Task 생성 (카테고리 id 값 넣어서)
    const newTask = await addTask({
        title,
        planner_date,
        task_category_id,
        userId
        });
    
    if (!newTask) {
        throw error;
    }

    return {
        id: newTask.id,
        title: newTask.title,
        planner_date: newTask.planner_date,
        task_category_id: newTask.task_category_id,
        isCompleted: newTask.isCompleted
    };
};

export const createTaskCategoryBulk = async ({taskData, task_category_id, userId }) => {
    
    console.log("request received to Service and userId", taskData, task_category_id, userId);  
    const addedTaskData = [];
    try {
        await isDeletedUser(userId);
        const category = await prisma.taskCategory.findUnique({
            where: {
                id: BigInt(task_category_id),
            },
        });
        if (category==null) {
            throw new NoExistsCategoryError({ categoryId: task_category_id });  
        }
        // task_category가 본인것인지 확인. 
        if (category.userId !== BigInt(userId)) {
            throw new UnauthorizedCategoryAccessError({ categoryId: task_category_id, userId });
        };
        for (const task of taskData) {
            const newTask = await addTask({...task, task_category_id, userId});
            if (!newTask) {
                throw new Error("할일 생성에 실패했습니다.");
            }
            addedTaskData.push(newTask);    
        }
        return addedTaskData;
    } catch (error) {
        throw error;
    }
} 