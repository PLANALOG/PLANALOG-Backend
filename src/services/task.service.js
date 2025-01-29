import { addTask, changeTask, getTaskFromRepository, deleteTaskFromRepository, taskCompletionChange } from "../repositories/task.repository.js";
import { prisma } from "../db.config.js";
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
    export const deleteTask = async (ids, userId) => {
      try {
          // 권한 확인 및 삭제 대상 조회
          const tasksToDelete = await prisma.task.findMany({
              where: { id: { in: ids } },
              include: { planner: true },
          });
  
          if (tasksToDelete.length === 0) {
              throw new Error("No tasks found for the given IDs.");
          }
  
          // 사용자 권한 확인
          const unauthorizedTasks = tasksToDelete.filter(
              (task) => task.planner.userId !== BigInt(userId)
          );
          if (unauthorizedTasks.length > 0) {
              throw new Error("Unauthorized: You cannot delete tasks that you don't own.");
          }
  
          // 삭제 실행 및 반환
          const deletedTasks = await deleteTaskFromRepository(ids);
          return deletedTasks; // 삭제된 항목 반환
      } catch (error) {
          throw error;
      }
  };
    export const getTask = async (taskData) => {
      // Task 조회 로직
      try {
        const receivedTask = await getTaskFromRepository(taskData);
        return receivedTask;
      }catch (error) {
        throw error;
      }
    }
  export const toggleTaskCompletion = async (taskData) => {
    // Task 완료상태 수정 로직
    try {
      const toggledTask = await taskCompletionChange(taskData);
      return toggledTask;
    } catch (error) {
      throw error;
    }
  }
