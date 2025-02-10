import { prisma } from '../db.config.js';
import { DuplicateCategoryError } from '../errors.js';
export const createCategoryRepository = async ({ userId, name }) => {
    
    try {
        //중복 값 확인 
        const bigIntUserId = BigInt(userId);
        const existingCategory = await prisma.taskCategory.findFirst({
            where: {name: name, userId: bigIntUserId}
        });
        if (existingCategory) {
            // 중복 에러 코드 설정 
            throw new DuplicateCategoryError(); 
        }
        // 카테고리 생성
        const createdCategory = await prisma.taskCategory.create({
            data: {
                userId: bigIntUserId,
                name: name,
            },
        });
        return createdCategory;
    } catch (error) {
        throw new Error("Database error: Failed to create task category");
    }
};
// 카테고리 수정
export const updateCategoryRepository = async (id, name) => {
    const bigIntUserId = BigInt(userId);
    try {
        const updatedCategory = await prisma.taskCategory.update({
            where: {
                id: bigIntUserId, 
            },
            data: {
                name: name, // 새로운 이름으로 업데이트
                updatedAt: new Date(), // 업데이트 시간 기록 (자동으로 설정되지 않는 경우)
            },
        });
        return updatedCategory;
    } catch (error) {
        throw new Error("Database error: Failed to update task category");
    }
};

// 유저별 카테고리 조회
export const getAllCategoriesRepository = async (userId) => {
    const bigIntUserId = BigInt(userId);

    try {
        const categories = await prisma.taskCategory.findMany({
            where: {
                userId: bigIntUserId, // 사용자 ID로 필터링
            },
            orderBy: {
                createdAt: "desc", // 최신 순으로 정렬
            },
        });
        return categories;
    } catch (error) {
        throw new Error("Database error: Failed to fetch task categories");
    }
};

export const deleteCategoryRepository = async (ids) => {
    try {
        // 1️⃣ 배열의 모든 ID를 BigInt로 변환
        const bigIntIds = ids.map((id) => BigInt(id));

        // 2️⃣ Prisma deleteMany 사용
        const deletedCategory = await prisma.taskCategory.deleteMany({
            where: {
                id: { in: bigIntIds },
            },
        });

        return deletedCategory;
    } catch (error) {
        throw new Error("Database error: Failed to delete task category");
    }
};

export const createTaskCategoryRepository = async ({ task_category_id, title, planner_date }) => {
    try {
        // 데이터베이스에 카테고리 추가
        const newTaskCategory = await prisma.task.create({
            data: {
                title: title,
                plannerDate: new Date(planner_date),
                taskCategoryId: BigInt(task_category_id), // task_category_id와 연결
            },
        });

        return newTaskCategory;
    } catch (error) {
        throw new Error("Database error occurred while creating task category.");
    }
};