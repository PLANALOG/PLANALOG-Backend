import express from "express";
import {handleCreateCategory, handleUpdateCategory, handleViewCategory , handleDeleteCategory,
    handleCreateTaskCategory, handleCreateCategoryBulk, handleCreateTaskCategoryBulk
} from "../controllers/category.controller.js";


const router = express.Router();
// 카테고리 생성
router.post("/", handleCreateCategory);
// 카테고리 다중생성 
router.post("/bulk/", handleCreateCategoryBulk);
// 카테고리형 유저 할일 생성
router.post("/:task_category_id/tasks", handleCreateTaskCategory);
// 카테고리형 유저 할일 다중생성 
router.post("/:task_category_id/tasks/bulk", handleCreateTaskCategoryBulk);
// 카테고리 수정 
router.patch("/:task_category_id/", handleUpdateCategory);

//유저의 카테고리 조회
router.get("/", handleViewCategory);

// 카테고리 삭제 
router.delete("/", handleDeleteCategory);

export default router;