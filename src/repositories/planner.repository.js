import { prisma } from '../db.config.js';
import { UnauthorizedPlannerDeletionError } from '../errors.js';
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
    if (plannerToObject.userId !== userId) throw new UnauthorizedPlannerDeletionError();

    //리팩토링가능? 



    const deletedPlanner = await prisma.planner.delete({ where: { id: plannerId } });

    return deletedPlanner;
}