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
export const updateCategoryRepository = async (data) => {
    //카테고리 수정정
    try {

    }catch (error) {
        throw new Error();
    }
}

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