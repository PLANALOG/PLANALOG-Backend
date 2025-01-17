import { addTask, changeTask, getTaskFromRepository, deleteTaskFromRepository } from "../repositories/task.repository.js";

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
          // 3. 저장된 결과 반환
          return savedTask;
        }
        catch (error) {
          //에러 기록
          console.error("Error adding task:", error.message);
          //에러를 상위로 전달 
          throw error;
        }

        
    }

    export const updateTask= async (taskData) => {
      // Task 수정 로직 
       
      try {
        const changedTask = await changeTask(taskData)
        // 수정된 Task 반환환
        return changedTask;
       
      }
      catch(error) {
        throw error;
      }
      
    }
    export const deleteTask= async (taskData) => {
      // Task 삭제 로직
      try {
        const deletedTask = await deleteTaskFromRepository (taskData);
        return deletedTask;
      }catch (error) {
        throw error; 
      }
    }
    export const getTask = async (taskData) => {
      // Task 조회 로직
      try {
        const receivedTask = await getTaskFromRepository(taskData);
        return receivedTask;
      }catch (error) {
        throw error;
      }
    }
  
