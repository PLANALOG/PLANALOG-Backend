import { prisma } from "../db.config.js";

// 알림 생성
export const createNotice = async (userId, { message, entityType, entityId }) => {
  return await prisma.notice.create({
    data: {
      userId: BigInt(userId),
      message,
      entityType,
      entityId,
      isRead: false, // 생성 시 읽지 않은 상태로 기본 설정
    },
  });
};


// 알림 읽음 상태 수정
export const updateNoticeReadStatus = async (noticeId, isRead, userId) => {
  // 알림 존재 및 소유 확인
  const notice = await prisma.notice.findUnique({
    where: {
      id: BigInt(noticeId),
    },
  });

  if (!notice) {
    throw new Error("알림이 존재하지 않습니다.");
  }

  if (notice.userId !== BigInt(userId)) {
    throw new Error("해당 알림에 대한 수정 권한이 없습니다.");
  }

  // 알림 읽음 상태 업데이트
  return await prisma.notice.update({
    where: {
      id: BigInt(noticeId),
    },
    data: {
      isRead,
    },
  });
};


// 알림 삭제
export const deleteNotice = async (noticeId, userId) => {
  // 알림 존재 여부 및 소유권 확인
  const notice = await prisma.notice.findUnique({
    where: {
      id: BigInt(noticeId),
    },
  });

  if (!notice) {
    throw new Error("해당 알림이 존재하지 않습니다.");
  }

  if (notice.userId !== BigInt(userId)) {
    throw new Error("해당 알림에 대한 삭제 권한이 없습니다.");
  }

  // 알림 삭제
  return await prisma.notice.delete({
    where: {
      id: BigInt(noticeId),
    },
  });
};



// 특정 유저의 알림 목록 조회
export const getNoticesByUserId = async (userId) => {
  return await prisma.notice.findMany({
    where: {
      userId: BigInt(userId),
    },
    orderBy: {
      createdAt: "desc", // 최신 순으로 정렬
    },
  });
};
