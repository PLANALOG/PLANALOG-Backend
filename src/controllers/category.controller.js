import {createCategory,
        updateCategory,
        getCategoriesByUser,
        deleteCategory
} from '../services/category.service.js'

// 카테고리 생성
export const handleCreateCategory = async (req, res, next) => {

    try {
        //세션에서 userId 가져오기 
        const userId = req.user.id;
        const name = req.body.name;
        console.log("Data received to controller(userId, name):", userId, name);

        // userId 있는지 확인 
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }
        
        const createdTaskCategory = await createCategory({userId, name}); // 서비스 호출
        res.success(createdTaskCategory); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 카테고리 수정
// 카테고리 수정
export const handleUpdateCategory = async (req, res, next) => {
    try {
        const { task_categories_id } = req.params; // URL에서 ID 추출
        const { name } = req.body; // 요청 본문에서 새로운 카테고리 이름 추출

        if (!name) {
            return res.error({
                errorCode: "INVALID_INPUT",
                reason: "Category name is required",
            });
        }

        const updatedTaskCategory = await updateCategory(task_categories_id, name); // 서비스 호출
        res.success(updatedTaskCategory); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 유저의 카테고리 조회
export const handleViewCategory = async (req, res, next) => {
    try {
        const userId = req.user.id; // 인증 미들웨어에서 가져온 사용자 ID
        const taskCategories = await getCategoriesByUser(userId); // 서비스 호출
        res.success(taskCategories); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};

// 카테고리 삭제
export const handleDeleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params; // URL에서 ID 추출
        const deletedCategory = await deleteCategory(id); // 서비스 호출
        res.success({ message: "Task category deleted successfully" }); // 성공 응답
    } catch (error) {
        next(error); // 전역 오류 처리 미들웨어로 전달
    }
};