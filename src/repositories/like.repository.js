import { prisma } from "../db.config.js";

// 좋아요 추가
export const addPostLike = async (data) => {
  console.log("Repository Input:", data);

  const existingLike = await prisma.like.findFirst({
    where: {
      fromUserId: data.fromUserId,
      userId: data.userId,
      entityId: data.entityId,
      entityType: data.entityType,
    },
  });

  if (existingLike) {
    return null;
  }

  const newLike = await prisma.like.create({
    data: {
      entityType: data.entityType,
      entityId: data.entityId,
      user: { connect: { id: data.userId } },         
      fromUser: { connect: { id: data.fromUserId } }, 
    },
  });
  
  console.log("Created Like:", newLike);
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