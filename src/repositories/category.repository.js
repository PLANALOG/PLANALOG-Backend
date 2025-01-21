import { prisma } from '../db.config.js';

export const createCategoryRepository = async ({ userId, name }) => {
    try {
        // 카테고리 생성
        const createdCategory = await prisma.taskCategory.create({
            data: {
                userId: userId,
                name: name,
            },
        });
        return createdCategory;
    } catch (error) {
        console.error("Error creating task category:", error);
        throw new Error("Database error: Failed to create task category");
    }
};
// 카테고리 수정
export const updateCategoryRepository = async (id, name) => {
    try {
        const updatedCategory = await prisma.taskCategory.update({
            where: {
                id: BigInt(id, 10), // ID를 Bigint로 변환
            },
            data: {
                name: name, // 새로운 이름으로 업데이트
                updatedAt: new Date(), // 업데이트 시간 기록 (자동으로 설정되지 않는 경우)
            },
        });
        return updatedCategory;
    } catch (error) {
        console.error("Error updating task category:", error);
        throw new Error("Database error: Failed to update task category");
    }
};

// 유저별 카테고리 조회
export const getAllCategoriesRepository = async (userId) => {
    try {
        const categories = await prisma.taskCategory.findMany({
            where: {
                userId: parseInt(userId, 10), // 사용자 ID로 필터링
            },
            orderBy: {
                createdAt: "desc", // 최신 순으로 정렬
            },
        });
        return categories;
    } catch (error) {
        console.error("Error fetching task categories:", error);
        throw new Error("Database error: Failed to fetch task categories");
    }
};

export const deleteCategoryRepository = async (data) => {
    //카테고리 삭제 
    try {

    }catch (error) {
        throw new Error();
    }
}