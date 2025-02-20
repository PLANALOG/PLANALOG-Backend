import { 
  ValidationError, 
  DuplicateLikeMomentError, 
  momentIdNotFoundError, 
  LikeIdNotExistError, 
  LikeIdMissingError, 
  LikeNotOwnedByUserError, 
  DatabaseError, 
  handleServerError 
} from "../errors.js";

import { addMomentLike, removeMomentLike } from "../repositories/like.repository.js";
import { prisma } from "../db.config.js";

// 공통 DB 오류 처리 함수
const handleDatabaseError = (error, message) => {
  if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
    throw new DatabaseError("데이터베이스 연결에 실패했습니다.", error);
  }
  throw new DatabaseError(message, error);
};


export const likeMoment = async (data) => {
  try {
    // 입력값 검증
    if (!data.entityId || !data.entityType || !data.userId) { 
      throw new ValidationError(data);
    }

    // 게시글 존재 여부 확인
    const momentExists = await prisma.moment.findUnique({
      where: { id: data.entityId }, 
    });

    if (!momentExists) {
      throw new momentIdNotFoundError({ entityId: data.entityId }); 
    }

    // 좋아요 추가
    const likeMomentId = await addMomentLike({
      fromUserId: data.fromUserId,
      userId: data.userId, 
      entityId: data.entityId, 
      entityType: data.entityType 
    });

    if (!likeMomentId) {
      throw new DuplicateLikeMomentError(data);
    }

    return {
      likeId: likeMomentId,
      message: "좋아요가 성공적으로 추가되었습니다.",
    };

  } catch (error) {
    // 사용자의 잘못된 요청
    if (error instanceof ValidationError || 
        error instanceof momentIdNotFoundError || 
        error instanceof DuplicateLikeMomentError) {
      throw error; 
    }

    try {
      handleDatabaseError(error, "좋아요 추가 중 문제가 발생했습니다.");
    } catch (dbError) {
      throw dbError;
    }
    throw handleServerError(error);
  }
};

export const deleteMomentLike = async (data, userId) => {
  try {
    // 요청 데이터 유효성 검사
    if (!data?.likeId) {
      throw new LikeIdMissingError(data);
    }

    // DB에서 좋아요 데이터 조회
    const like = await prisma.like.findUnique({
      where: { id: data.likeId },
      select: { fromUserId: true }, //조회 최적화 추가
    });

    if (!like) {
      throw new LikeIdNotExistError(data);
    }

    if (String(like.fromUserId) !== String(userId)) {
      throw new LikeNotOwnedByUserError(data);
    }

    // 좋아요 삭제 실행
    await removeMomentLike({ likeId: data.likeId });

    return { message: "좋아요가 성공적으로 삭제되었습니다." };

  } catch (error) {
    // 사용자의 잘못된 요청
    if (error instanceof LikeIdMissingError || 
        error instanceof LikeIdNotExistError || 
        error instanceof LikeNotOwnedByUserError) {
      throw error;
    }

    // 데이터베이스 오류 감지
    try {
      handleDatabaseError(error, "좋아요 삭제 중 문제가 발생했습니다.");
    } catch (dbError) {
      throw dbError;
    }
    
    // 예상치 못한 서버 내부 오류 처리
    throw handleServerError(error);
  }
};