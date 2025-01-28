

export const responseFromPlannerWithTasks = (data) => {
    const tasks = [];
    data.tasks.forEach(task => {
        tasks.push({
            taskId: task.id,
            title: task.title,
            isCompleted: task.isCompleted,
            taskCategoryId: task.taskCategory?.id,
            taskCategoryName: task.taskCategory?.name
        })
    });
    return {
        plannerId: data.id,
        userId: data.userId,
        isCompleted: data.isCompleted,
        tasks

    }

}

export const responseFromPlannerCalendarView = (data, month, nextMonth) => {
    const planners = [];
    data.forEach(planner => {
        const plannerDate = planner.plannerDate.toISOString().split('T')[0];
        planners.push({
            plannerId: planner.id,
            plannerDate,
            isCompleted: planner.isCompleted
        })
    });

    //toISOString : 날짜를 yyyy-mm-ddThh:mm:ss:sssZ 형식의 문자열로로 반환
    const startDate = month.toISOString().split('T')[0];
    const endDate = nextMonth.toISOString().split('T')[0];


    return {
        startDate,
        endDate,
        planners
    }
}