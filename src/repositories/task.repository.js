import { prisma } from "../db.config.js";
import { getPlannerWithTasks } from "./planner.repository.js"; // 기존 코드 활용
import { DuplicateTaskError, TaskNotFoundError, TaskDeleteNotFoundError, UnauthorizedTaskAccessError } from "../errors.js";

export const addTask = async (data) => {
    // Prisma를 사용하여 DB에 새로운 Task 생성
    // task_category_id가 있으면 BigInt 변환, 없으면 null
    console.log("data 확인", data);
    const category_id = data.task_category_id ? BigInt(data.task_category_id) : null;

    if (data.category_id) {
        category_id = data.category_id;
    }

    const bigIntUserId = BigInt(data.userId);
    

    // 해당 날짜에 플래너가 있는지 조회
    // 해당 날짜의 플래너 확인 (기존 코드 활용)
    let planner = await getPlannerWithTasks(bigIntUserId, data.planner_date);
    console.log("planner 날짜로 확인", planner);

    // 플래너가 있는지 확인하고 없으면 플래너 생성. 

    
    // 플래너가 없으면 새로 생성
    if (!planner) {
        console.log("Planner not found. Creating a new planner...");
        planner = await prisma.planner.create({
            data: {
                plannerDate: data.planner_date,
                userId: bigIntUserId,
                isCompleted: false,
            },
        });
        console.log("New planner created:", planner);
    }
    // 중복존재하는지 여부는 플래너 id와 task 이름으로 확인 
    const existingTask = await prisma.task.findFirst({
        where: {
            title: data.title,
            plannerId: planner.id
        }
    });

    if (existingTask) {
        throw new DuplicateTaskError();
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
        }
    }
    )
    if (!existingTask) {
        throw new TaskNotFoundError();
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
    });

    return updatedTask;
};

export const getTaskFromRepository = async (planner_date) => {
    
    const plannerWithTasks = await prisma.planner.findFirst({
        where: {
            plannerDate: planner_date
        },
        include: {tasks: true}
    }
    );

    
    return plannerWithTasks.tasks;
};

export const deleteTaskFromRepository = async (ids) => {
    try {
        // 삭제할 항목 조회
        const tasksToDelete = await prisma.task.findMany({
            where: { id: { in: ids } },
        });

        if (tasksToDelete.length === 0) {
            throw new TaskDeleteNotFoundError();
        }

        // 삭제 실행
        await prisma.task.deleteMany({
            where: { id: { in: ids } },
        });

        // 삭제된 항목 반환
        return tasksToDelete; // 삭제 전에 조회한 데이터를 반환
    } catch (error) {
        throw error;
    }
};

export const taskCompletionChange = async (taskId, userId) => {
    try {
        // 있는지 확인 
        console.log("data in repository",taskId, userId);    
        const task = await prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                planner: { // ✅ Planner 정보 포함
                  select: { id: true, userId: true } // ✅ Planner의 userId 가져오기
                }
              }
        });
        if (!task) {
            throw new TaskNotFoundError();
        }
        // Task 를 변경하려는 사용자가 task 접근 권한이 있는지 확인
        
        if (task.planner.userId !== userId) {
            console.log("Task의 userId 확인", task.planner.userId, userId); 
            throw new UnauthorizedTaskAccessError();
        }

        const changedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                // 값 반대로 바꾸기
                isCompleted: !task.isCompleted
            }
        })

        return changedTask;
    } catch (error) {
        throw error;
    }
};
export const findTaskWithPlanner = async (data) => {
    // task_id를 bigint로 바꾸기 
    const taskId = typeof (data.task_id) === "string" ? BigInt(data.task_id) : data.task_id;
    return await prisma.task.findFirst({
        where: { id: taskId },
        include: {
            planner: {
                // 연결된 Planner에서 userId도 가져옴
                select: { userId: true }
            }
        }
    });
};


