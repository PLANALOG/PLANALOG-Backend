import { prisma } from '../db.config.js';
import { DuplicateCategoryError } from '../errors.js';
export const createCategoryRepository = async ({ userId, name }) => {
    
    try {
        //중복 값 확인 
        const bigIntUserId = BigInt(userId);

        const existingCategory = await prisma.taskCategory.findFirst({
            where: {name: name, userId: bigIntUserId}
        });
        console.log("existingCategory 확인", existingCategory);

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
        throw error
    }
};
// 카테고리 수정
export const updateCategoryRepository = async (id, name) => {

    
    const bigIntId = BigInt(id);

    try {
        // 중복값 확인 
        const existingCategory = await prisma.taskCategory.findFirst({
            where: {name: name, id: bigIntId}
        });

        if (existingCategory) {
            // 중복 에러 코드 설정 
            throw new DuplicateCategoryError(); 
        }
        // 카테고리 업데이트
        const updatedCategory = await prisma.taskCategory.update({
            where: {

                id: bigIntId, 

            },
            data: {
                name: name// 새로운 이름으로 업데이트
            },
        });
        return updatedCategory;
    } catch (error) {
        throw error;
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
        throw new Error("데이터 베이스 에러입니다. 카테고리 조회에 실패했습니다다.");
    }
};
//카테고리 id 별로 조회 
export const getCategoryById = async (id) => {
    const bigIntId = BigInt(id);
    try {
        const category = await prisma.taskCategory.findUnique({
            where: {
                id: bigIntId,
            },
        });
        return category;
    } catch (error) {
        throw new Error("데이터 베이스 에러입니다. 카테고리 조회에 실패했습니다.");
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
        throw new Error("데이터 베이스 에러입니다. 카테고리 삭제제에 실패했습니다.");
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
        throw new Error("데이터 베이스 에러입니다. 카테고리형 할일 추가가에 실패했습니다.");
    }
};