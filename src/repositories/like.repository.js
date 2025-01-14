import { prisma } from "../db.config.js";


// 좋아요 추가
export const addPostLike = async (data) => {
  const existingLike = await prisma.like.findFirst({
    where: { fromUserId: data.fromUserId, entityId: data.entityId },
  });

  if (existingLike) {
    return null;
  }

  const newLike = await prisma.like.create({
    data: { fromUserId: data.fromUserId, entityId: data.entityId },
  });

  return newLike.id;
};

// 좋아요 삭제
export const removePostLike = async (data) => {
  const existingLike = await prisma.like.findUnique({
    where: { id: data.likeId },
  });

  if (!existingLike) {
    return false;
  }

  await prisma.like.delete({ where: { id: data.likeId } });
  return true;
};
