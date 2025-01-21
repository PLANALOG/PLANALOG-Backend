import express from "express";
import {handleCreateCategory, handleUpdateCategory } from "../controllers/category.controller.js";

const router = express.Router();

//task 카테고리 생성. 

router.post("/", handleCreateCategory);


//task 카테고리 수정 
router.patch("/:task_categories_id/", handleUpdateCategory);

export default router;