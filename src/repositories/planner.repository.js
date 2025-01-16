import { prisma } from '../db.config.js';

export const getPlannerWithTasks = async (userId, plannerDate) => {

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