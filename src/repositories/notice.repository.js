import { prisma } from "../db.config.js";


// 알림 생성
export const createNotice = async (fromUserId, toUserId, { message, entityType, entityId }) => {
  return await prisma.notice.create({
    data: {
      fromUserId: BigInt(fromUserId),
      toUserId: BigInt(toUserId),
      message,
      entityType,
      entityId,
      isRead: false,
    },
  });
};

// 알림 읽음 상태 수정
export const updateNoticeReadStatus = async (noticeId, isRead, userId) => {
  const notice = await prisma.notice.findUnique({
    where: {
      id: BigInt(noticeId),
    },
  });

  if (!notice) {
    throw new Error("알림이 존재하지 않습니다.");
  }

  if (notice.toUserId !== BigInt(userId)) {  // ✅ userId -> toUserId로 변경
    throw new Error("해당 알림에 대한 수정 권한이 없습니다.");
  }

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
  const notice = await prisma.notice.findUnique({
    where: {
      id: BigInt(noticeId),
    },
  });

  if (!notice) {
    throw new Error("해당 알림이 존재하지 않습니다.");
  }

  if (notice.toUserId !== BigInt(userId)) {  // ✅ userId -> toUserId로 변경
    throw new Error("해당 알림에 대한 삭제 권한이 없습니다.");
  }

  return await prisma.notice.delete({
    where: {
      id: BigInt(noticeId),
    },
  });
};

// 나에게 온 알림 조회할 때, 보낸 사람(`fromUserId`)의 `name` 포함
export const getNoticesByUserId = async (userId) => {
  return await prisma.notice.findMany({
    where: {
      toUserId: BigInt(userId), //
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      fromUser: {  
        select: { id: true, name: true },
      },
    },
  });
};