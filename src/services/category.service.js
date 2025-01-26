import {
    createCategoryRepository,
    updateCategoryRepository,
    getAllCategoriesRepository,
    deleteCategoryRepository,
    createTaskCategoryRepository
} from "../repositories/category.repository.js";


export const createCategory = async ({ userId, name }) => {
    //카테고리 생성성
    console.log("category data in service", userId, name);
    try {
        // 리포지토리 호출
        const createdCategory = await createCategoryRepository({ userId, name });
        return createdCategory;
    } catch (error) {
        throw new Error("Failed to create task category");
    }
};
// 카테고리 수정
export const updateCategory = async (id, name) => {
    try {
        const updatedCategory = await updateCategoryRepository(id, name); // 리포지토리 호출
        if (!updatedCategory) {
            throw new Error("Category not found or failed to update");
        }
        return updatedCategory;
    } catch (error) {
        throw new Error("Failed to update task category");
    }
};

// 유저별 카테고리 조회
export const getCategoriesByUser = async (userId) => {
    try {
        const viewedCategories = await getAllCategoriesRepository(userId); // 리포지토리 호출
        if (!viewedCategories || viewedCategories.length === 0) {
            throw new Error("No categories found for the user");
        }
        return viewedCategories;
    } catch (error) {
        throw new Error("Failed to fetch task categories");
    }
};

export const deleteCategory = async (id) => {
    try {
        const deletedCategory = await deleteCategoryRepository(id);

        if (!deletedCategory) {
            throw new Error("Task category not found or could not be deleted");
        }

        return deletedCategory;
    } catch (error) {
        throw new Error("Failed to delete task category");
    }
};
export const createTaskCategory = async ({ task_category_id, title, planner_date }) => {
    // 서비스 로직: 예외 처리, 비즈니스 로직 추가
    if (!task_category_id || isNaN(task_category_id)) {
        throw new Error("Invalid task_category_id");
    }

    const newTaskCategory = await createTaskCategoryRepository({
        task_category_id,
        title,
        planner_date,
    });

    if (!newTaskCategory) {
        throw new Error("Failed to create task category.");
    }

    return {
        id: newTaskCategory.id,
        title: newTaskCategory.title,
        planner_date: newTaskCategory.planner_date,
    };
};