import { createNoticeService,getNoticesService, deleteNoticeService,updateNoticeReadStatusService } from "../services/notice.service.js";
import { validateCreateNoticeDTO,validateDeleteNoticeDTO ,validateUpdateNoticeReadDTO } from "../dtos/notice.dto.js";
import { StatusCodes } from "http-status-codes";


export const createNotice = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { message, entityType, entityId } = req.body; 

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const validatedNotice = validateCreateNoticeDTO({ message, entityType, entityId });

    const notice = await createNoticeService(userId, validatedNotice);

    res.status(StatusCodes.CREATED).json({
      message: "알림 생성 성공",
      data: notice,
    });
  } catch (error) {
    console.error("알림 생성 중 에러:", error.message);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};



export const updateNoticeReadStatus = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { noticeId } = req.params; 
    const { isRead } = req.body; 

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const { isRead: validatedIsRead } = validateUpdateNoticeReadDTO(isRead);

    const updatedNotice = await updateNoticeReadStatusService(noticeId, true, userId);

    res.status(StatusCodes.OK).json({
      message: "알림 읽음 상태 수정 성공",
      data: updatedNotice,
    });
  } catch (error) {
    console.error("알림 읽음 상태 수정 중 에러:", error.message);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};





export const deleteNotice = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { noticeId } = req.params; 

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const { noticeId: validatedNoticeId } = validateDeleteNoticeDTO(noticeId);

    await deleteNoticeService(validatedNoticeId, userId);

    res.status(StatusCodes.OK).json({
      message: "알림 삭제 성공",
    });
  } catch (error) {
    console.error("알림 삭제 중 에러:", error.message);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};



export const getNotices = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const notices = await getNoticesService(userId);

    res.status(StatusCodes.OK).json({
      message: "알림 조회 성공",
      data: notices,
    });
  } catch (error) {
    console.error("알림 조회 중 에러:", error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 내부 오류",
      error: error.message,
    });
  }
};
