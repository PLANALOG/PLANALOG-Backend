import { prisma } from "../db.config.js";

export const createMoment = async (data) => {
    return await prisma.$transaction(async (prisma) => {
        // Planner ID 검증 (기존에는 서비스 계층에서 수행했음)
        if (data.plannerId) {
            const planner = await prisma.planner.findUnique({
                where: { id: data.plannerId },
            });

            if (!planner) {
                throw new Error("해당 Planner를 찾을 수 없습니다. 올바른 plannerId를 입력해주세요.");
            }
        }

        // Moment 생성
        const createMoment = await prisma.moment.create({
            data: {
                userId: data.userId,
                title: data.title,
                status: data.status,
                plannerId: data.plannerId || null,
            },
            include: { momentContents: true },
        });

        // MomentContent 추가
        if (data.momentContents?.length > 0) {
            const contents = data.momentContents.map((content, index) => ({
                momentId: createMoment.id,
                momentContentId: content.momentContentId || index + 1,
                content: content.content ?? null,
                url: content.url || null,
            }));
            await prisma.momentContent.createMany({ data: contents });
        } else if (data.status === "draft") {
            await prisma.momentContent.create({
                data: {
                    momentId: createMoment.id,
                    momentContentId: 1,
                    content: null,
                    url: null,
                },
            });
        }

        return createMoment; 
    });
};
