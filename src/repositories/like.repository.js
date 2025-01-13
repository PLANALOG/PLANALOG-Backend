import { prisma } from "../db.config.js";

// 게시글에 좋아요 추가
export const addPostLike = async (userId, postId) => {
  // 이미 좋아요를 눌렀는지 확인
  const existingLike = await prisma.Like.findFirst({
    where: { userId, entityId: postId, entityType: "post" },
  });

  if (existingLike) {
    throw new Error("이미 이 게시글에 좋아요를 눌렀습니다.");
  }

  // 좋아요 추가
  const newLike = await prisma.like.create({
    data: {
      userId: userId,
      entityId: postId,
      entityType: "post",
    },
  });

  return newLike;
};

// 게시글의 좋아요 삭제
export const removePostLike = async (userId, postId) => {
  // 좋아요가 존재하는지 확인
  const existingLike = await prisma.cheer.findFirst({
    where: { userId, entityId: postId, entityType: "post" } });

  if (!existingLike) {
    throw new Error("좋아요를 누른 적이 없습니다.");
  }

  // 좋아요 삭제
  await prisma.like.delete({
    where: { id: existingLike.id },
  });

  return true;
};
