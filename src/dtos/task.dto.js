export const createTaskDto = (body) => {

    // 1. Validate title
    if (!body.title) {
        throw new Error("Title is required");
    }

    // 2. Validate planner_date
    if (!body.planner_date) {
        throw new Error("Planner date is required");
    }
    const planner_date = new Date(body.planner_date + "T00:00:00.000Z"); // ✅ 초 단위까지 동일하게 변환

    // 3. 데이터 반환 
    return {
        title: body.title,
        planner_date: planner_date,
    };

}
export const createTaskBulkDto = (body) => {
    console.log("dto titles",body.titles);
    // body 는 배열 형태의 제목들(String)과 String 형태의 날짜
    // 1. 배열 검증 (title이 배열인지 확인)
    if (!body.titles || !Array.isArray(body.titles) || body.titles.length === 0) {
        throw new Error("할일들들(titles)은 배열 형태로 전달되어야 합니다.");
    }

    // 2. planner_date가 문자열인지 확인
    if (!body.planner_date || typeof body.planner_date !== "string") {
        throw new Error("planner_date는 문자열이어야 합니다.");
    }

    // 3. DTO 변환 (각각 개별의 할 일 객체로 변환 할일 => {할일, 날짜})
    return body.titles.map(title => ({
        title: title,
        planner_date: new Date(body.planner_date) 
        
    }));
};
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