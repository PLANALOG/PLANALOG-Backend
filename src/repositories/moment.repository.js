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
                date: data.date,
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
        // 사용자 Moments 조회
        const moments = await prisma.moment.findMany({
            where: {
                userId: BigInt(userId),
            },
            include: {
                user: { select: { name: true } }, // 사용자 이름 추가
                momentContents: {
                    select: { url: true },
                    take: 1, // 대표 이미지 -> 썸네일 이미지
                },
                _count: {
                    select: {
                        comments: true, // 댓글 개수
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // 개별 moment에 대해 likes 개수를 Prisma에서 별도로 조회
        for (const moment of moments) {
            const likesCount = await prisma.like.count({
                where: {
                    entityId: Number(moment.id), // BigInt → Number 변환
                    entityType: "moment", // moment에 해당하는 좋아요만 조회
                },
            });
            moment.likingCount = likesCount; // 좋아요 개수 추가
        }

        console.log("현재 사용자 Moments:", JSON.stringify(moments, null, 2));
        return moments;
    } catch (error) {
        console.error("DB 조회 오류:", error);
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


// 친구들의 Moment 목록 조회 (status: public만 조회)
export const findFriendsMoments = async (userId) => {
  // 친구 목록 조회
  const friendIds = await prisma.friend.findMany({
    where: {
        fromUserId: BigInt(userId),
        isAccepted: true,
    },
    select: {
        toUserId: true,
    },
  });

  const friendUserIds = friendIds.map(friend => friend.toUserId);

  return await prisma.moment.findMany({
    where: {
      userId: { in: friendUserIds },
      status: 'public',
    },
    include: {
      momentContents: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// 친구의 특정 Moment 상세 조회 (status: public만 조회)
export const findFriendMomentDetail = async (userId, momentId) => {
  // 친구인지 확인
  const isFriend = await prisma.friend.findFirst({
    where: {
      fromUserId: BigInt(userId),
      isAccepted: true,
    },
  });

  if (!isFriend) {
    throw new Error("친구가 아닌 사용자입니다.");
  }

  return await prisma.moment.findFirst({
    where: {
      id: BigInt(momentId),
      userId: isFriend.toUserId,
      status: 'public',
    },
    include: {
      momentContents: true,
    },
  });
};