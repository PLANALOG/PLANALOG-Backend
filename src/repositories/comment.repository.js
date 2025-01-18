import { prisma } from "../db.config.js";

export const addComment = async (data) => { //댓글 데이터 받기 
    console.log("Repository Input:", data); //디버깅용

    const postExists = await prisma.post.findUnique({
        where:{ id: data.postId},
    });
    if(!postExists){
        throw new Error("게시글을 찾을 수 없습니다."); 
}
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