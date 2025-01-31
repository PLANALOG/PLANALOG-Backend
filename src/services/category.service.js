import {
    createCategoryRepository,
    updateCategoryRepository,
    getAllCategoriesRepository,
    deleteCategoryRepository,
    createTaskCategoryRepository
} from "../repositories/category.repository.js";

import { addTask } from "../repositories/task.repository.js";



export const createCategory = async ({ userId, name }) => {
    //카테고리 생성
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
export const createTaskCategory = async ({ task_category_id, title, planner_date, userId }) => {
    // 서비스 로직: 예외 처리, 비즈니스 로직 추가
    if (!task_category_id || isNaN(task_category_id)) {
        throw new Error("Invalid task_category_id");
    }


    // Task 생성 (카테고리 id 값 넣어서)
    const newTask = await addTask({
        title,
        planner_date,
        task_category_id: task_category_id,
        userId        
        });

    if (!newTask) {
        throw new Error("Failed to create task category.");
    }

    return {
        id: newTask.id,
        title: newTask.title,
        planner_date: newTask.planner_date,
        task_category_id: newTask.task_category_id,
        isCompleted: newTask.isCompleted
    };
};