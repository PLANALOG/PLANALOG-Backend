import { addTask, changeTask, getTaskFromRepository, deleteTaskFromRepository, taskCompletionChange } from "../repositories/task.repository.js";
import { prisma } from "../db.config.js";
import { updatePlannerIsCompleted, deletePlannerWithNoTasks } from "../repositories/planner.repository.js";
import { TaskNotFoundError, UnauthorizedTaskAccessError } from "../errors.js";

export const createTask = async (taskData) => {
  console.log("request received to Service:", taskData);
  // Task 생성 로직
  const task = {
    "title": taskData.title,
    "planner_date": taskData.planner_date,
    "userId": taskData.userId
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
export const createTaskBulk = async (taskData, userId) => {
  console.log("request received to Service and userId", taskData, userId);
  console.log("type of taskData", typeof taskData);
  const addedTaskData = [];
  
  try {
    //반복문으로 taskData의 각 요소를 하나씩 받아서 task 생성
    for (const task of taskData) {
      const newTask = await addTask({...task, userId});
      addedTaskData.push(newTask);
    }
    return addedTaskData;
  } catch (error) {
    throw error;
  }
};

export const updateTask = async (taskData) => {
  // Task 수정 로직 

  try {
    const changedTask = await changeTask(taskData);
    // 수정된 Task 반환환
    return changedTask;

  }
  catch (error) {
    throw error;
  }

};
export const deleteTask = async (ids, userId) => {
  try {
    // 권한 확인 및 삭제 대상 조회
    const tasksToDelete = await prisma.task.findMany({
      where: { id: { in: ids } },
      include: { planner: true },
    });

    if (tasksToDelete.length === 0) {
      throw new TaskNotFoundError ();
    }

    // 사용자 권한 확인
    const unauthorizedTasks = tasksToDelete.filter(
      (task) => task.planner.userId !== BigInt(userId)
    );
    if (unauthorizedTasks.length > 0) {
      throw new UnauthorizedTaskAccessError({ taskIds: unauthorizedTasks.map((task) => task.id) });
    }

    // 삭제 실행 및 반환
    const deletedTasks = await deleteTaskFromRepository(ids);


    // 해당 플래너의 할일이 모두 삭제됐으면 플래너도 삭제 
    // 한번에 삭제되는 task들은 같은 planner에 존재하므로 plannerId 하나만 추출
    await deletePlannerWithNoTasks(deletedTasks[0].plannerId);

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
  } catch (error) {
    throw error;
  }
}
export const toggleTaskCompletion = async (taskData) => {
  // Task 완료상태 수정 로직
  try {
    const toggledTask = await taskCompletionChange(taskData);

    //만약 해당 플래너의 모든 task가 완료되었으면 플래너의 isCompleted값 변경
    const plannerId = toggledTask.plannerId;
    const newPlannerIsCompleted = await updatePlannerIsCompleted(plannerId);
    //newIsCompleted는 플래너의 isCompleted 값이 변경되었으면 변경된 boolean값, 변경되지 않았다면 null값 

    return { toggledTask, newPlannerIsCompleted };
  } catch (error) {
    throw error;
  }
}
