import {PostIdNotFoundError,ContentNotFoundError,CommentIdNotFoundError} from "../errors.js";
import {addComment,editComment,deleteComment,getAllPostComments} from "../repositories/comment.repository.js";
import { prisma } from "../db.config.js";
import { responseFromComments } from "../dtos/comment.dto.js";

export const addUserComment = async (data) =>{
    const postExists = await prisma.post.findUnique({
        where: { id: data.postId },
    });
    if (!postExists) {
        throw new PostIdNotFoundError("존재하지 않는 게시글입니다.", data);
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError("댓글 내용이 비어 있습니다.", data);
    }

    const addNewCommentId = await addComment({
        userId: data.userId,
        postId: data.postId,
        content: data.content,
        createdAt: data.createdAt || new Date(),
});
    return addNewCommentId;
};

export const editUserComment = async(data) =>{
    const commentExists = await prisma.comment.findUnique({
        where: { id: data.commentId },
    });
    if (!commentExists) {
        throw new CommentIdNotFoundError("존재하지 않는 댓글입니다.",data);
    }
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError("댓글 내용이 비어 있습니다.", data);
    }
    const updatedComment = await editComment({
        userId: data.userId,
        postId: data.postId,
        commentId: data.commentId,
        content: data.content,
        updatedAt: data.updatedAt || new Date(),
}); 
    return updatedComment;
};

export const deleteUserComment = async(data) =>{
    const commentExists = await prisma.comment.findUnique({
        where: { id: data.commentId },
    });
    if (!commentExists) {
        throw new CommentIdNotFoundError("존재하지 않는 댓글입니다.",data);
    }
        // 댓글 작성자이거나 게시물 작성자인 경우만 삭제 허용
    if (data.userId !== comment.userId && data.userId !== post.userId) {
        throw new Error("삭제 권한이 없습니다.");
    }
    const removeComment = await deleteComment({
        userId: data.userId,
        postId: data.postId,
        commentId: data.commentId,
    });
    return removeComment;
}

export const listComments = async (postId) => {
    const comments = await getAllPostComments(postId);
    return responseFromComments(comments);
};
