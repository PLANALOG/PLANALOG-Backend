export const createTaskDto = (body) => {

    // 1. Validate title
    if (!body.title) {
        throw new Error("할 일 제목이 필요합니다");
    }

    // 2. Validate planner_date
    if (!body.planner_date) {
        throw new Error("Planner 날짜가 필요합니다다");
    }
    const planner_date = new Date(body.planner_date); 
    // 3. 데이터 반환 
    return {
        title: body.title,
        planner_date: planner_date,
    };

}
export const createTaskBulkDto = (body) => {
    
    // body 는 배열 형태의 제목들(String)과 String 형태의 날짜
    // 1. 배열 검증 (title이 배열인지 확인)
    if (!body.titles || !Array.isArray(body.titles) || body.titles.length === 0) {
        throw new Error("할일들(titles)은 배열 형태로 전달되어야 합니다.");
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
        throw new Error("Task_id 가 숫자가 아닙니다.");
    }
    // 데이터 이름 확인 
    if (!body.title) {
        throw new Error("할일 제목이 필요합니다.");
    }
    return {
        task_id: BigInt(task_id),
        title: body.title
    }
}
export const getTaskDto = (planner_date) => {
    console.log("planner_date", planner_date);
    if (typeof planner_date !== "string") {
        throw new Error("planner_date 는 문자열이어야 합니다.");
    }

    const date = new Date(planner_date);

    if (isNaN(date.getTime())) {
        throw new Error("planner_date 값이 올바른 날짜 형식이 아닙니다. (예: YYYY-MM-DD)");
    }

    return date;
};


export const responseFromToggledTask = ( tasks, newIsCompleted ) => {
    console.log("반환값 확인 task :", tasks, ", newIsCompleted :", newIsCompleted);

    // 개별 task를 포맷팅하는 함수
    const formatTask = (task) => {
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
  };

  // 전달된 tasks가 배열이면 map으로, 단일 객체면 바로 포맷팅하여 반환
  if (Array.isArray(tasks)) {
    return tasks.map(formatTask);
  } else {
    return formatTask(tasks);
  }
};
    