import { createNotice,getNoticesByUserId,updateNoticeReadStatus,deleteNotice   } from "../repositories/notice.repository.js";
import { formatNoticeListDTO } from "../dtos/notice.dto.js";


export const createNoticeService = async (userId, noticeData) => {
  return await createNotice(userId, noticeData);
};


export const updateNoticeReadStatusService = async (noticeId, isRead, userId) => {
  return await updateNoticeReadStatus(noticeId, isRead, userId);
};


export const deleteNoticeService = async (noticeId, userId) => {
  
  return await deleteNotice(noticeId, userId);
};


export const getNoticesService = async (userId) => {
  const notices = await getNoticesByUserId(userId);
  
  return formatNoticeListDTO(notices);
};
