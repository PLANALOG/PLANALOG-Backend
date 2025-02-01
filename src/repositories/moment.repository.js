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
                sortOrder: content.sortOrder || index + 1,
                content: content.content ?? null,
                url: content.url || null,
            }));
            await prisma.momentContent.createMany({ data: contents });
        } else if (data.status === "draft") {
            await prisma.momentContent.create({
                data: {
                    momentId: createMoment.id,
                    sortOrder: 1,
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
        const updatedMoment = await prisma.moment.update({
            where: { id: momentId },
            data: {
                title: data.title,
                status: data.status,
            },
            include: { momentContents: true },
        });

        // 1️⃣ 페이지를 삭제 처리할 경우
        if (data.deletedSortOrders?.length > 0) {
            for (const sortOrder of data.deletedSortOrders) {
                // 해당 콘텐츠 삭제
                await prisma.momentContent.deleteMany({
                    where: {
                        momentId: momentId,
                        sortOrder: sortOrder,
                    },
                });

                // 삭제한 콘텐츠 이후의 sortOrder를 -1로 조정
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

        // 2️⃣ 페이지의 콘텐츠를 수정 및 추가할 경우
        for (const content of data.momentContents) {
            if (content.sortOrder) {
                // 그중에서 기존 콘텐츠를 수정할 경우
                await prisma.momentContent.update({
                    where: {
                        momentId_sortOrder: {
                            momentId: momentId,
                            sortOrder: content.sortOrder,
                        },
                    },
                    data: {
                        content: content.content ?? null,
                        url: content.url || null,
                    },
                });
            } else if (content.insertAfterId) {
                // 3️⃣ 아니면 새로운 콘텐츠 삽입할 경우
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


// 나의 Moment 목록 조회
export const findMyMoments = async (userId) => {
  return await prisma.moment.findMany({
    where: {
      userId: BigInt(userId),
      status: { not: "draft" }
    },
    include: {
      momentContents: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// 나의 특정 Moment 상세 조회
export const findMyMomentDetail = async (userId, momentId) => {
  return await prisma.moment.findFirst({
    where: {
        id: BigInt(momentId),
        userId: BigInt(userId),
        status: { not: "draft" }
    },
    include: {
      momentContents: true,
    },
  });
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

