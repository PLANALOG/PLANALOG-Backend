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

export const getAllCategoriesRepository = async (data) => {
    //카테고리 조회 (userId별로로)
    try {

    }catch (error) {
        throw new Error();
    }

}

export const deleteCategoryRepository = async (data) => {
    //카테고리 삭제 
    try {

    }catch (error) {
        throw new Error();
    }
}