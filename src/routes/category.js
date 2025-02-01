import express from "express";
import {handleCreateCategory, handleUpdateCategory, handleViewCategory , handleDeleteCategory,
    handleCreateTaskCategory
} from "../controllers/category.controller.js";


const router = express.Router();

router.post("/", handleCreateCategory);


router.post("/:task_category_id/tasks", handleCreateTaskCategory);

    
router.patch("/:task_category_id/", handleUpdateCategory);


router.get("/", handleViewCategory);

 
router.delete("/:task_category_id", handleDeleteCategory);

export default router;