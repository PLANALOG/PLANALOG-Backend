import { prisma } from '../db.config.js';
import { isDeletedUser } from './user.repository.js';

export const getPlannerWithTasks = async (userId, plannerDate) => {

    await isDeletedUser(userId);

    const plannerWithTasks = await prisma.planner.findFirst({
        select: {
            id: true,
            userId: true,
            plannerDate: true,
            isCompleted: true,
            tasks: {
                select: {
                    id: true,
                    title: true,
                    isCompleted: true,
                    taskCategory: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }

        }, where: {
            userId,
            plannerDate,
        }
    })

    return plannerWithTasks
}

export const getMonthPlanners = async (userId, plannerMonth, plannerNextMonth) => {
    await isDeletedUser(userId);

    const monthPlannerList = await prisma.planner.findMany({
        select: {
            id: true,
            plannerDate: true,
            isCompleted: true
        },
        where: {
            userId,
            plannerDate: {
                gte: plannerMonth,
                lt: plannerNextMonth
            }
        }
    })
    return monthPlannerList;
}

export const deletePlanner = async (plannerId, userId) => {
    await isDeletedUser(userId);

    //해당 플래너 존재하는 지 & 유저의 플래너가 맞는 지 확인 
    const planner = await prisma.planner.findFirst({ where: { id: plannerId } });

    if (!planner) return null;

    // 반환된 객체에서 userId는 bigint타입이라 1이 아닌 1n으로 출력
    // userId와 비교하기위해 bigint -> int로의 변환이 필요 
    // 객체 -> JSON(문자열)로 변환 후 다시 객체로 변환하면 int로 출력 가능 

    // 객체를 JSON(문자열)으로 변환
    const plannerToJson = JSON.stringify(planner, (key, value) => (typeof value === 'bigint' ? value.toString() : value));

    // 다시 객체로 변환 (bigint => int)
    const plannerToObject = JSON.parse(plannerToJson);

    // planner의 userId가 요청한 유저와 다르면 에러 반환 
    if (plannerToObject.userId !== userId) throw new Error('플래너를 삭제할 권한이 없습니다. 본인의 플래너만 삭제할 수 있습니다.');

    //리팩토링가능? 



    const deletedPlanner = await prisma.planner.delete({ where: { id: plannerId } });

    return deletedPlanner;
}

export const deletePlannerWithNoTasks = async (plannerId) => {
    const isExistTasks = await prisma.task.findFirst({ where: { plannerId } });

    var isDeletedPlanner = false;

    if (!isExistTasks) {
        await prisma.planner.delete({
            where: { id: plannerId }
        });
        isDeletedPlanner = true;
    };

    return isDeletedPlanner;
}


//플래너의 할 일이 모두 완료됐는지 여부에 따라, 플래너의 isCompleted 값 변경
export const updatePlannerIsCompleted = async (plannerId) => {

    // 해당 plannerId를 가진 task 중 isCompleted = false인 task가 존재하는 지 확인 
    const notCompleteTask = await prisma.task.findFirst({
        where: {
            plannerId,
            isCompleted: false
        }
    });

    // planner의 기존 isCompleted 값 가져오기기
    var plannerIsCompleted = await prisma.planner.findFirst({
        where: { id: plannerId },
        select: { isCompleted: true }
    });

    plannerIsCompleted = plannerIsCompleted.isCompleted;

    if (!plannerIsCompleted && !notCompleteTask) { //모든 할 일이 완료되고 플래너의 isCompleted가 false였다면 
        await prisma.planner.update({
            where: {
                id: plannerId
            },
            data: {
                isCompleted: true //isCompleted를 ture로로 변경 
            }
        });

        plannerIsCompleted = true;
        return plannerIsCompleted;

    } else if (plannerIsCompleted && notCompleteTask) { //완료되지 않은 할일이 존재하는데 isCompleted가 true였다면 
        await prisma.planner.update({
            where: { id: plannerId },
            data: {
                isCompleted: false //isCompleted를 false로 변경 
            }
        });

        plannerIsCompleted = false;
        return plannerIsCompleted;
    };

    return null;
}