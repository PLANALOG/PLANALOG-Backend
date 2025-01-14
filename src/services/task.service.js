import { addTask } from "../repositories/task.repository.js";

export const createTask= async (taskData) => {
        console.log("request received to Service:", taskData);
        // Task 생성 로직
        const task = {
            "title": taskData.title,
            "planner_date": taskData.planner_date
        }
    
         // 2. Repository 계층에 저장 요청
        try {
          const savedTask = await addTask(task);
          
        }
        catch (error) {
          //에러 기록
          console.error("Error adding task:", error.message);
          //에러를 상위로 전달 
          throw error;
        }
    
        // 3. 저장된 결과 반환
        return savedTask;
    }

    const updateTask= (taskId, taskData) => {
      // Task 수정 로직
    }
    const deleteTask= async (taskId) => {
      // Task 삭제 로직
    }
    const getTask = async (taskId) => {
      // Task 조회 로직
    }
  
