

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