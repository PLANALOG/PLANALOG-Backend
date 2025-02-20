import { prisma } from "../db.config.js";

export const createMoment = async (data) => {
    return await prisma.$transaction(async (prisma) => {
        if (data.plannerId !== null && data.plannerId !== undefined) {
            const planner = await prisma.planner.findUnique({
                where: { id: data.plannerId }
            });
            if (!planner) {
                throw new Error("유효하지 않은 plannerId입니다.");
            }
        }

        const createMoment = await prisma.moment.create({
            data: {
                userId: data.userId,
                title: data.title,
                plannerId: data.plannerId ?? null,
            }
        });

        if (data.momentContents?.length > 0) {
            const contents = data.momentContents.map((content) => ({
                momentId: createMoment.id,
                sortOrder: content.sortOrder,
                content: content.content,
                url: content.url ?? null
            }));
            await prisma.momentContent.createMany({ data: contents });
        }

        // moment와 momentContents를 다시 조회하여 반환
        const momentWithContents = await prisma.moment.findUnique({
            where: { id: createMoment.id },
            include: { momentContents: true }
        });

        return momentWithContents;
    });
};





export const updateMoment = async (momentId, data) => {
    return await prisma.$transaction(async (prisma) => {
        // Moment 존재 여부 확인
        const existingMoment = await prisma.moment.findUnique({
            where: { id: momentId },
        });

        if (!existingMoment) {
            throw new Error(`Moment ID ${momentId}에 해당하는 데이터가 존재하지 않습니다.`);
        }

        // 기존 Moment 업데이트
        const updatedMoment = await prisma.moment.update({
            where: { id: momentId },
            data: {
                title: data.title,
            },
            include: { momentContents: true },
        });

        // 페이지 삭제 처리
        if (data.deletedSortOrders?.length > 0) {
            for (const sortOrder of data.deletedSortOrders) {
                await prisma.momentContent.deleteMany({
                    where: {
                        momentId: momentId,
                        sortOrder: sortOrder,
                    },
                });

                await prisma.momentContent.updateMany({
                    where: {
                        momentId: momentId,
                        sortOrder: { gt: sortOrder },
                    },
                    data: {
                        sortOrder: { decrement: 1 },
                    },
                });
            }
        }

        // 콘텐츠 수정 및 추가 처리
        for (const content of data.momentContents) {
            if (content.sortOrder) {
                // 기존 콘텐츠 수정
                await prisma.momentContent.updateMany({
                    where: {
                        momentId: momentId,
                        sortOrder: content.sortOrder,
                    },
                    data: {
                        content: content.content ?? null,
                        url: content.url || null,
                    },
                });
            } else if (content.insertAfterId) {
                // 새로운 콘텐츠 삽입
                await prisma.momentContent.updateMany({
                    where: {
                        momentId: momentId,
                        sortOrder: { gt: content.insertAfterId },
                    },
                    data: {
                        sortOrder: { increment: 1 },
                    },
                });

                await prisma.momentContent.create({
                    data: {
                        momentId: momentId,
                        sortOrder: content.insertAfterId + 1,
                        content: content.content ?? null,
                        url: content.url || null,
                    },
                });
            }
        }

        return updatedMoment;
    });
};



export const deleteMomentFromDB = async (momentId) => {
    return await prisma.$transaction(async (prisma) => {
        // 삭제할 Moment가 존재하는지 확인
        const existingMoment = await prisma.moment.findUnique({
            where: { id: momentId },
        });

        if (!existingMoment) {
            throw new Error("삭제할 Moment를 찾을 수 없습니다.");
        }

        // Moment 삭제 (momentContents도 같이 삭제됨됨)
        await prisma.moment.delete({
            where: { id: momentId },
        });

        // 성공적으로 삭제되었으면 true 반환
        return true;
    });
};


export const findMyMoments = async (userId) => {
    try {
        console.log(`[findMyMoments] API 호출됨! userId: ${userId}`);

        const moments = await prisma.moment.findMany({
            where: { userId: BigInt(userId) },
            include: {
                user: { select: { name: true } },
                momentContents: { select: { url: true }, take: 1 },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: "desc" },
        });

        for (const moment of moments) {
            const likesCount = await prisma.like.count({
                where: {
                    entityId: Number(moment.id),
                    entityType: "moment",
                },
            });
            moment.likingCount = likesCount;
        }

        return moments;
    } catch (error) {
        console.error("[findMyMoments] DB 조회 오류:", error);
        throw new Error("Moment 목록 조회 실패");
    }
};



// 나의 특정 Moment 상세 조회
export const findMyMomentDetail = async (userId, momentId) => {
    try {

        const moment = await prisma.moment.findUnique({
            where: { id: BigInt(momentId) },
            include: {
                momentContents: true,
                planner: true
            }
        });

        return moment;
    } catch (error) {
        console.error("DB 조회 오류:", error.message); //  에러 로그
        throw error;
    }
};


export const findOtherUserMoments = async (userId) => {
    try {

        const moments = await prisma.moment.findMany({
            where: { userId: BigInt(userId) },
            include: {
                user: { select: { name: true } },
                momentContents: { select: { url: true }, take: 1 },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: "desc" },
        });

        for (const moment of moments) {
            const likesCount = await prisma.like.count({
                where: {
                    entityId: Number(moment.id),
                    entityType: "moment",
                },
            });
            moment.likingCount = likesCount;
        }

        return moments;
    } catch (error) {
        console.error("[findOtherUserMoments] DB 조회 오류:", error);
        throw new Error("Moment 목록 조회 실패");
    }
};





// 특정 사용자의 특정 Moment 상세 조회
export const findOtherUserMomentDetail = async (userId, momentId) => {
    try {

        const moment = await prisma.moment.findUnique({
            where: { id: momentId },  // BigInt 대신 number로 직접 처리
            include: {
                momentContents: true,
                planner: true
            }
        });

        if (!moment) {
            throw new Error("Moment를 찾을 수 없습니다.");
        }
        return moment;
    } catch (error) {
        console.error("[findOtherUserMomentDetail] DB 조회 오류:", error.message);
        throw error;
    }
};
