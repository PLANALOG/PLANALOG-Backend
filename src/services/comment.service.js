import {momentIdNotFoundError,ContentNotFoundError,CommentIdNotFoundError} from "../errors.js";
import {addComment,editComment,deleteComment,getAllmomentComments} from "../repositories/comment.repository.js";
import { prisma } from "../db.config.js";
import { responseFromComments } from "../dtos/comment.dto.js";

export const addUserComment = async (data) =>{
    const momentExists = await prisma.moment.findUnique({
        where: { id: data.momentId },
    });
    if (!data.userId) {
        throw new Error("userId가 요청되지 않았습니다.");
    }
    if (!momentExists) {
        throw new momentIdNotFoundError("존재하지 않는 게시글입니다.", data);
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError("댓글 내용이 비어 있습니다.", data);
    }

    const addNewCommentId = await addComment({
        userId: data.userId,
        momentId: data.momentId,
        content: data.content,
        createdAt: data.createdAt || new Date(),
});
    return addNewCommentId;
};

export const editUserComment = async(data) =>{
    const momentExists = await prisma.moment.findUnique({
        where: { id: data.momentId },
    });

    if (!momentExists) {
        throw new momentIdNotFoundError("존재하지 않는 게시글입니다.", { momentId: data.momentId });
    }

    const commentExists = await prisma.comment.findUnique({
        where: { id: data.commentId },
    });

    if (!commentExists) {
        throw new CommentIdNotFoundError("존재하지 않는 댓글입니다.",data);
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError("댓글 내용이 비어 있습니다.", data);
    }
    if (data.userId !== commentExists.userId) {
        throw new PermissionDeniedError("수정 권한이 없습니다.", data);
    }
    const updatedComment = await editComment({
        userId: data.userId,
        momentId: data.momentId,
        commentId: data.commentId,
        content: data.content,
        updatedAt: data.updatedAt || new Date(),
}); 
    return updatedComment;
};

export const deleteUserComment = async(data) =>{
    const commentExists = await prisma.comment.findUnique({
        where: { id: data.commentId },
        include: { moment: true }
    });
    if (!commentExists) {
        throw new CommentIdNotFoundError("존재하지 않는 댓글입니다.",data);
    }
        // 댓글 작성자이거나 게시물 작성자인 경우만 삭제 허용
        if (data.userId !== commentExists.userId && data.userId !== commentExists.moment.userId) {
            throw new PermissionDeniedError("삭제 권한이 없습니다.",data);
        }
    const removeComment = await deleteComment({
        userId: data.userId,
        momentId: data.momentId,
        commentId: data.commentId,
    });
    return removeComment;
}

export const listComments = async (momentId) => {
  // 게시글 존재 여부 확인
  const momentExists = await prisma.moment.findUnique({
    where: { id: momentId },
});
if (!momentExists) {
    throw new momentIdNotFoundError("존재하지 않는 게시글입니다.", { momentId });
}
// 댓글 목록 조회
const comments = await getAllmomentComments({ momentId, cursor });
//댓글이 없는 경우 빈 배열 반환
return responseFromComments(comments || []);
};