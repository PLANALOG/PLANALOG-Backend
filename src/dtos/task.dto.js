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
        planner_date: body.planner_date,
      };

    }
