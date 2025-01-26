import express from "express";
import {handleCreateCategory, handleUpdateCategory, handleViewCategory , handleDeleteCategory,
    handleCreateTaskCategory
} from "../controllers/category.controller.js";


const router = express.Router();

//task 카테고리 생성. 

router.post("/", handleCreateCategory);
//카테고리 분류된 할일 생성
router.post("/:task_category_id/tasks", handleCreateTaskCategory);
//task 카테고리 수정 
router.patch("/:task_category_id/", handleUpdateCategory);

//task 카테고리 조회 
router.get("/", handleViewCategory);

//task 카테고리 삭제 
router.delete("/:task_category_id", handleDeleteCategory);

export default router;