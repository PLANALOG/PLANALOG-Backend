import { scheduleJob } from "node-schedule"
import { prisma } from "./db.config.js"

export const userDeleteScheduler = async () => {
    scheduleJob('0 0 0 * * *', async () => {
        // 매일 자정에 실행되는 스케줄러
        // 탈퇴한 지 14일이 지난 유저를 삭제
        console.log("스케줄러 실행")

        const now = new Date();
        now.setDate(now.getDate() - 14);

        const deletedUsers = await prisma.user.deleteMany({
            where: {
                isDeleted: true,
                deletedAt: {
                    lte: now
                }
            }
        });

        console.log(deletedUsers);

    });
}