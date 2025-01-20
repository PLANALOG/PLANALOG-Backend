import { createNotice } from "../repositories/notice.repository.js";
import { getNoticesByUserId } from "../repositories/notice.repository.js";
import { formatNoticeListDTO } from "../dtos/notice.dto.js";
import { deleteNotice } from "../repositories/notice.repository.js";
import { updateNoticeReadStatus } from "../repositories/notice.repository.js";

export const createNoticeService = async (userId, noticeData) => {
  // 레포지토리 호출하여 알림 생성
  return await createNotice(userId, noticeData);
};


export const updateNoticeReadStatusService = async (noticeId, isRead, userId) => {
  // 읽음 상태 수정 로직 호출
  return await updateNoticeReadStatus(noticeId, isRead, userId);
};


export const deleteNoticeService = async (noticeId, userId) => {
  
  return await deleteNotice(noticeId, userId);
};


export const getNoticesService = async (userId) => {
  const notices = await getNoticesByUserId(userId);
  
  return formatNoticeListDTO(notices);
};
