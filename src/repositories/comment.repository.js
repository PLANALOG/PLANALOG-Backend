import { prisma } from "../db.config.js";

export const addComment = async (data) => { //댓글 데이터 받기 
    console.log("Repository Input:", data); //디버깅용
    const newComment = await prisma.comment.create({
        data:{
            userId: data.userId,
            momentId: data.momentId,
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
            momentId: data.momentId,
            content: data.content,
            updatedAt: data.updatedAt || new Date(),
    },
    });
    console.log("Updated Comment:", updatedComment);
    return updatedComment;
    };

export const deleteComment = async (data) => {
    console.log("Repository Input:", data);
    const eraseComment = await prisma.comment.delete({ 
        where: { id: data.commentId },
    });
    console.log("Delete Comment:", eraseComment);
    return eraseComment;
    };

export const getAllmomentComments =  async({ momentId, cursor }) => {
    const comments = await prisma.comment.findMany({
        select:{
            id: true,
            content: true,
            momentId: true,
            userId: true,
            createdAt: true,
        },
        where: {
            momentId: momentId,
            ...(cursor !== undefined ? { id: { gt: cursor } } : {}), // undefined 처리
        },
        orderBy:{id:"asc"},  //정렬 기준
        take: 5, // 페이지 크기
    });
return comments;
};