import express from "express";
import {handleCreateCategory, handleUpdateCategory, handleViewCategory } from "../controllers/category.controller.js";

const router = express.Router();

//task 카테고리 생성. 

router.post("/", handleCreateCategory);


//task 카테고리 수정 
router.patch("/:task_categories_id/", handleUpdateCategory);

//task 카테고리 조회 
router.get("/", handleViewCategory);

export default router;