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