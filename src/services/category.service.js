import {
    createCategoryRepository,
    updateCategoryRepository,
    getAllCategoriesRepository,
    deleteCategoryRepository
} from "../repositories/category.repository.js";


export const createCategory = async ({ userId, name }) => {
    console.log
    try {
        // 리포지토리 호출
        const createdCategory = await createCategoryRepository({ userId, name });
        return createdCategory;
    } catch (error) {
        throw new Error("Failed to create task category");
    }
};
export const updateCategory = async (id, name) => {
    try {
        const updatedCategory = await updateCategoryRepository(id, name);
        return updatedCategory;
    } catch (error) {
        throw new Error("Failed to update task category");
    }
};

export const getCategoriesByUser = async (userId) => {
    try {
        const viewedCategories = await getAllCategoriesRepository(userId);
        return viewedCategories;
    } catch (error) {
        throw new Error("Failed to fetch task categories");
    }
};

export const deleteCategory = async (id) => {
    try {
        const deletedCategory = await deleteCategoryRepository(id);
        
        return deletedCategory;
    } catch (error) {
        throw new Error("Failed to delete task category");
    }
};