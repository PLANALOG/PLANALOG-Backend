import {momentIdNotFoundError,ContentNotFoundError,CommentIdNotFoundError,ContentTooLongError,PermissionDeniedError,DatabaseError, handleServerError} from "../errors.js";
import {addComment,editComment,deleteComment,getAllmomentComments} from "../repositories/comment.repository.js";
import { prisma } from "../db.config.js";
import { responseFromComments } from "../dtos/comment.dto.js";

// 공통 DB 오류 처리 함수
const handleDatabaseError = (error, message) => {
    if (error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
      throw new DatabaseError("데이터베이스 연결에 실패했습니다.", error);
    }
    throw new DatabaseError(message, error);
  };

  
export const addUserComment = async (data) =>{
try {
    const momentExists = await prisma.moment.findUnique({
        where: { id: data.momentId },
    });
    if (!momentExists) {
        throw new momentIdNotFoundError(data);
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError(data);
    }
    if (data.content.length > 500) {
        throw new ContentTooLongError(data);
    }
    
    const addNewCommentId = await addComment({
        userId: data.userId,
        momentId: data.momentId,
        content: data.content,
        createdAt: data.createdAt || new Date(),
});
    return addNewCommentId;
} catch (error) {
    if (error instanceof momentIdNotFoundError || 
        error instanceof ContentNotFoundError || 
        error instanceof ContentTooLongError) {
        throw error;
    }

    try {
      handleDatabaseError(error, "댓글 추가 중 문제가 발생했습니다.");
    } catch (dbError) {
      throw dbError;
    }
    throw handleServerError(error);
  }
};

export const editUserComment = async(data) =>{
 try{
    const momentExists = await prisma.moment.findUnique({
        where: { id: data.momentId },
    });

    if (!momentExists) {
        throw new momentIdNotFoundError({ momentId: data.momentId });
    }

    const commentExists = await prisma.comment.findUnique({
        where: { id: data.commentId },
    });

    if (!commentExists) {
        throw new CommentIdNotFoundError(data); 
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError(data);
    }

    if (BigInt(data.userId) !== commentExists.userId) {
        throw new PermissionDeniedError(data);
    }
    if (data.content.length > 500) {
        throw new ContentTooLongError(data);
    }
    const updatedComment = await editComment({
        userId: data.userId,
        momentId: data.momentId,
        commentId: data.commentId,
        content: data.content,
        updatedAt: data.updatedAt || new Date(),
}); 
    return updatedComment;
    } catch (error) {
        if (error instanceof momentIdNotFoundError || 
            error instanceof CommentIdNotFoundError || 
            error instanceof ContentNotFoundError || 
            error instanceof ContentTooLongError ||
            error instanceof PermissionDeniedError) {
            throw error;
        }

    try {
        handleDatabaseError(error, "댓글 수정 중 문제가 발생했습니다.");
    } catch (dbError) {
        throw dbError;
    }
    throw handleServerError(error);
    }
    };

export const deleteUserComment = async(data) =>{
    try {
        const commentExists = await prisma.comment.findUnique({
            where: { id: BigInt(data.commentId) },
            include: { moment: true }
    });


    if (!commentExists) {
        throw new CommentIdNotFoundError(data); 
    }
        // 댓글 작성자이거나 게시물 작성자인 경우만 삭제 허용
        if (BigInt(data.userId) !== commentExists.userId && data.userId !== commentExists.moment.userId) {
            throw new PermissionDeniedError(data);
        }

    const removeComment = await deleteComment({
        userId: data.userId,
        commentId: BigInt(data.commentId)
    });


    return removeComment;
} catch (error) {
    if (error instanceof CommentIdNotFoundError || 
        error instanceof PermissionDeniedError) {
        throw error;
    }

  try {
    handleDatabaseError(error, "댓글 삭제 중 문제가 발생했습니다.");
  } catch (dbError) {
    throw dbError;
  }
  throw handleServerError(error);
}
};

export const listComments = async (momentId,cursor) => { 
try {    
  // 게시글 존재 여부 확인
  const momentExists = await prisma.moment.findUnique({
    where: { id: momentId },
});
if (!momentExists) {
    throw new momentIdNotFoundError({ momentId });
}
// 댓글 목록 조회
const comments = await getAllmomentComments({ momentId, cursor });
//댓글이 없는 경우 빈 배열 반환
return responseFromComments(comments || []);
} catch (error) {
    if (error instanceof momentIdNotFoundError) {
        throw error;
    }
    
    try {
      handleDatabaseError(error, "댓글 목록 조회 중 문제가 발생했습니다.");
    } catch (dbError) {
      throw dbError;
    }
    throw handleServerError(error);
  }
};