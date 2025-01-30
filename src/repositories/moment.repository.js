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

export const updateMoment = async (momentId, data) => {
    return await prisma.$transaction(async (prisma) => {
        // 1️⃣ Moment 수정 (title, status 변경)
        const updatedMoment = await prisma.moment.update({
            where: { id: momentId },
            data: {
                title: data.title,
                status: data.status,
            },
            include: { momentContents: true }, // 수정 후 momentContents 포함
        });

        // 2️⃣ MomentContent 수정 및 추가
        for (const content of data.momentContents) {
            if (content.momentContentId) {
                // 기존 momentContent 업데이트
                await prisma.momentContent.update({
                    where: {
                        momentId_momentContentId: {
                            momentId: momentId,
                            momentContentId: content.momentContentId,
                        },
                    },
                    data: {
                        content: content.content ?? null,
                    },
                });
            } else {
                // 새로운 momentContent 추가 (중간 삽입을 고려한 로직)
                const { insertAfterId } = content; // 사용자가 몇 번째 뒤에 삽입할지 명시함 (예: 2번째 뒤에 삽입)

                // 현재 momentId에 속한 모든 momentContents 조회 (momentContentId 기준 정렬)
                const existingContents = await prisma.momentContent.findMany({
                    where: { momentId: momentId },
                    orderBy: { momentContentId: "asc" },
                });

                let newMomentContentId;
                if (insertAfterId) {
                    // 사용자가 특정 ID(insertAfterId) 뒤에 삽입할 경우
                    newMomentContentId = insertAfterId + 1;

                    // 기존 momentContents에서 newMomentContentId 이상인 것들을 모두 +1 시켜 정렬
                    await prisma.momentContent.updateMany({
                        where: {
                            momentId: momentId,
                            momentContentId: { gte: newMomentContentId }, // insertAfterId보다 크거나 같은 값들
                        },
                        data: {
                            momentContentId: { increment: 1 }, // 모두 1씩 증가시켜 밀어냄
                        },
                    });
                } else {
                    // 기본적으로 마지막에 추가
                    const lastContent = existingContents[existingContents.length - 1];
                    newMomentContentId = lastContent ? lastContent.momentContentId + 1 : 1;
                }

                // 새로운 momentContent 삽입
                await prisma.momentContent.create({
                    data: {
                        momentId: momentId,
                        momentContentId: newMomentContentId,
                        content: content.content ?? null,
                    },
                });
            }
        }

        return updatedMoment;
    });
};
