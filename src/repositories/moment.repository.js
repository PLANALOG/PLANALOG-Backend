import { prisma } from "../db.config.js";

export const createMoment = async (data) => {
    return await prisma.$transaction(async (prisma) => {
        // ✅ plannerId가 존재할 때만 유효성 검증 수행
        if (data.plannerId !== null && data.plannerId !== undefined) {
            const planner = await prisma.planner.findUnique({
                where: { id: data.plannerId }
            });

            if (!planner) {
                throw new Error("유효하지 않은 plannerId입니다.");
            }
        }

        // Moment 생성
        const createMoment = await prisma.moment.create({
            data: {
                userId: data.userId,
                title: data.title,
                status: data.status,
                plannerId: data.plannerId || null  // ✅ plannerId가 없으면 null 처리
            },
            include: { momentContents: true }
        });

        // MomentContent 추가
        if (data.momentContents?.length > 0) {
            const contents = data.momentContents.map((content, index) => ({
                momentId: createMoment.id,
                sortOrder: content.sortOrder || index + 1,
                content: content.content ?? null,
                url: content.url || null
            }));
            await prisma.momentContent.createMany({ data: contents });
        } else if (data.status === "draft") {
            await prisma.momentContent.create({
                data: {
                    momentId: createMoment.id,
                    sortOrder: 1,
                    content: null,
                    url: null
                }
            });
        }

        return createMoment;
    });
};



export const updateMoment = async (momentId, data) => {
    return await prisma.$transaction(async (prisma) => {
        // 🔍 1️⃣ Moment 존재 여부 확인
        const existingMoment = await prisma.moment.findUnique({
            where: { id: momentId },
        });

        if (!existingMoment) {
            throw new Error(`Moment ID ${momentId}에 해당하는 데이터가 존재하지 않습니다.`);
        }

        // 2️⃣ 기존 Moment 업데이트
        const updatedMoment = await prisma.moment.update({
            where: { id: momentId },
            data: {
                title: data.title,
                status: data.status,
            },
            include: { momentContents: true },
        });

        // 3️⃣ 페이지 삭제 처리
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

        // 4️⃣ 콘텐츠 수정 및 추가 처리
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


// 기존 쿼리 (유저의 Moment 조회)
export const findMyMoments = async (userId) => {
    try {
        const moments = await prisma.moment.findMany({
            where: {
                userId: BigInt(userId), // ✅ 이 부분이 특정 사용자로 제한
                status: { not: "draft" } // ✅ draft 상태 제외
            },
            include: {
                momentContents: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        console.log("현재 사용자 Moments:", JSON.stringify(moments, null, 2));
        return moments;
    } catch (error) {
        console.error("DB 조회 오류:", error);
        throw new Error("Moment 목록 조회 실패");
    }
};

// 추가 디버깅: 필터링 조건 없이 모든 Moments 조회
export const findAllMomentsForDebug = async () => {
    const moments = await prisma.moment.findMany({
        include: { momentContents: true },
        orderBy: { createdAt: 'desc' }
    });
    console.log("DB의 모든 Moments (필터링 없음):", JSON.stringify(moments, null, 2));
    return moments;
};




// 나의 특정 Moment 상세 조회
export const findMyMomentDetail = async (userId, momentId) => {
    try {
        console.log("DB 쿼리 실행:", { userId, momentId }); // ✅ 쿼리 입력 로그

        const moment = await prisma.moment.findUnique({
            where: { id: BigInt(momentId) },
            include: {
                momentContents: true,
                planner: true
            }
        });

        console.log("DB 조회된 Moment:", moment); // ✅ 쿼리 결과 확인
        return moment;
    } catch (error) {
        console.error("DB 조회 오류:", error.message); // ✅ DB 에러 로그
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