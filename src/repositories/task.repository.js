import { prisma } from "../db.config.js";

export const addTask = async (data) => {
    // Prisma를 사용하여 DB에 새로운 Task 생성
    // console.log("taskData received to repository", data);
    let category_id = null;
    if (data.category_id) {
        category_id = data.category_id;
    }
     // 해당 날짜에 플래너가 있는지 조회회
    let planner = await prisma.planner.findFirst({
        where: {
            plannerDate: new Date(data.planner_date)
        }
    });
    
    // 플래너가 있는지 확인하고 없으면 플래너 생성. 
    if (!planner) {
        console.log("Planner not found. Creating a new planner.");
        planner = await prisma.planner.create({
        data: {
            plannerDate: data.planner_date,
            userId: 1,
            isCompleted: false, 
            },
        });
    }

    // console.log("Planner ID to be used:", planner.id);

    //새로운 task 생성. 
    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        plannerId: planner.id,
        taskCategoryId: category_id, // 카테고리가 없으면 null
        isCompleted: false, // 기본값
      },
    });
    console.log("new task created:", newTask);
      return newTask;
  };