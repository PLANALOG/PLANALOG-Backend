import { prisma } from "../db.config.js";

export const addTask = async (data) => {
    // Prisma를 사용하여 DB에 새로운 Task 생성
    console.log("taskData received to repository", data);
    let category_id = null;
    if (data.category_id) {
        category_id = data.category_id;
    }
    // 해당 날짜에 플래너가 있는지 조회
    let planner = await prisma.planner.findFirst({
        where: {
            plannerDate: new Date(data.planner_date)
        }
    });
    console.log("planner 날짜로 확인", planner);

    // 플래너가 있는지 확인하고 없으면 플래너 생성. 
    // 아직 미완성 
    if (!planner) {
        console.log("Planner not found. Creating a new planner.");
        planner = await prisma.planner.create({
        data: {
            plannerDate: data.planner_date,
            userId: 1,
            isCompleted: false, 
            },
        });
        console.log("planner 새로 생성", planner);
    }
        
    // 중복존재하는지 여부는 플래너 id와 task 이름으로 확인 
    const existingTask = await prisma.task.findFirst({
        where: {
            title: data.title,
            plannerId: planner.id 
        }
    });

    if (existingTask) {
        throw new Error("이미 같은 날짜에 같은 Task가 존재합니다"); 
    }

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

  export const changeTask = async (data) => {
    // task_id 로 task 조회. id는 고유하기 떄문에 findUnique 사용 
    const existingTask = await prisma.task.findUnique({
        where: {
            id: data.task_id
        }}
    )
    if (!existingTask) {
        throw new Error("No such task exists");
    }

    console.log("Task 있는지 조회", existingTask);
    
    //task 업데이트 (Task 가 존재하는 경우)
    const updatedTask = await prisma.task.update({
        where: {
            id: data.task_id
        },
        data: {
            title: data.title
        }
    })
    
    return updatedTask;
  }

  export const getTaskFromRepository = async(task_id) => {
        const task = await prisma.task.findUnique({
            where: {
                id: task_id
            }
            }
        )
        if (!task) {
            throw new Error("No such Task exists");
        }
        return task;
  }