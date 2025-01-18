import { prisma } from "../db.config.js";

export const addComment = async (data) => { //댓글 데이터 받기 
    console.log("Repository Input:", data); //디버깅용
    const newComment = await prisma.comment.create({
        data:{
            userId: data.userId,
            postId: data.postId,
            content: data.content,
            createdAt: data.createdAt || new Date(),
        },
    });
    console.log("Created Comment:", newComment);
    return newComment.id;
};

export const editComment = async (data) => {
    console.log("Repository Input:", data);
    const updatedComment = await prisma.comment.update({ 
        where: { id: data.commentId },
        data:{userId: data.userId,
            postId: data.postId,
            content: data.content,
            updatedAt: data.updatedAt || new Date(),
    },
    });
    console.log("Updated Comment:", updatedComment);
    return updatedComment;
    };
