export const createTaskDto = (body) => {

    // 1. Validate title
    if (!body.title) {
        throw new Error("Title is required");
    }

    // 2. Validate planner_date
    if (!body.planner_date) {
        throw new Error("Planner date is required");
    }
    const planner_date = new Date(body.planner_date)
    // 3. 데이터 반환 
    return {
        title: body.title,
        planner_date: planner_date,
    };

}
export const updateTaskDto = (task_id, body) => {
    // task_id 숫자인지 확인 
    if (isNaN(task_id)) {
        throw new Error("Task_id is not a number");
    }
    // 데이터 이름 확인 
    if (!body.title) {
        throw new Error("Task title is required");
    }
    return {
        task_id: BigInt(task_id),
        title: body.title
    }
}
export const getTaskDto = (task_id) => {
    //task_id 숫자인지 확인
    if (isNaN(task_id)) {
        throw new Error("Task_id is not a number");
    }
    return {
        task_id: BigInt(task_id)
    }
    

}

export const responseFromToggledTask = ({ task, newIsCompleted }) => {
    console.log("반환값 확인 task :", task, ", newIsCompleted :", newIsCompleted);

    const response = {
        id: task.id,
        plannerId: task.plannerId,
        taskCategoryId: task.taskCategoryId,
        isCompleted: task.isCompleted,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
    };

    if (newIsCompleted !== null) {
        response.message = `해당 날짜의 플래너의 할 일 모두 완료 여부가 ${newIsCompleted}로 변경되었습니다`;
    }

    return response;
}