// 알림 생성 요청 데이터 검증
export const validateCreateNoticeDTO = ({ message, entityType, entityId }) => {
  if (!message || message.trim() === "") {
    throw new Error("알림 메시지는 필수입니다.");
  }
  if (!entityType) {
    throw new Error("알림 유형(entityType)은 필수입니다.");
  }
  if (!entityId || isNaN(Number(entityId))) {
    throw new Error("유효한 entityId가 필요합니다.");
  }

  return {
    message: message.trim(),
    entityType,
    entityId: Number(entityId),
  };
};


// 읽음 상태 수정 요청 검증
export const validateUpdateNoticeReadDTO = (isRead) => {
  if (typeof isRead !== "boolean") {
    throw new Error("isRead 값은 true 또는 false이어야 합니다.");
  }

  return {
    isRead,
  };
};


// 알림 삭제 요청 검증
export const validateDeleteNoticeDTO = (noticeId) => {
  if (!noticeId || isNaN(Number(noticeId))) {
    throw new Error("유효한 알림 ID가 필요합니다.");
  }

  return {
    noticeId: BigInt(noticeId),
  };
};





export const formatNoticeListDTO = (notices) => {
  return notices.map((notice) => ({
    id: notice.id,
    isRead: notice.isRead,
    message: notice.message,
    entityType: notice.entityType,
    entityId: notice.entityId,
    createdAt: notice.createdAt,
    fromUserId: notice.fromUser.id,  
    fromUserName: notice.fromUser.name, 
  }));
};


