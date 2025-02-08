import {
    createCategoryRepository,
    updateCategoryRepository,
    getAllCategoriesRepository,
    deleteCategoryRepository,
    createTaskCategoryRepository
} from "../repositories/category.repository.js";
import {prisma} from "../db.config.js";
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
// 카테고리 여러개 생성
export const createCategoryBulk = async ({userId, name}) => {
    console.log(
        "request received to Service and userId",
        userId,
        name
    );
    console.log("type of name", typeof name);
    const addedCategories = [];
    try {
        // 반복문으로 categories의 각 요소를 하나씩 받아서 카테고리 생성
        for (const category of name.name) {
            const newCategory = await createCategoryRepository({ userId, name: category });
            addedCategories.push(newCategory);
        }

        return addedCategories;
    } catch (error) {
        throw error;
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

export const deleteCategoryService = async (categoryIds, userId) => {
    try {
        // 1️⃣ 삭제 대상 카테고리 조회
        const categoriesToDelete = await prisma.taskCategory.findMany({
            where: { id: { in: categoryIds} }, 
            select: {id: true, userId: true}
        });

        if (categoriesToDelete.length === 0) {
            throw new Error("No task categories found for the given IDs.");
        }

        // 2️⃣ 사용자 권한 검증
        const unauthorizedCategories = categoriesToDelete.filter(
            (category) => category.userId !== BigInt(userId)
        );

        if (unauthorizedCategories.length > 0) {
            throw new Error("Unauthorized: You cannot delete categories that you don't own.");
        }

        // 3️⃣ 삭제 실행
        const deletedCategories = await deleteCategoryRepository(categoryIds);
        
        return deletedCategories; // 삭제된 항목 반환
    } catch (error) {
        throw new Error(`Failed to delete task categories: ${error.message}`);
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