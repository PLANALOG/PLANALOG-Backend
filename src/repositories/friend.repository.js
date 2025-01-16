// src/repositories/friend.repository.js
import { prisma } from "../db.config.js";


export const findExistingFriend = async (fromUserId, toUserId) => {
  return await prisma.friend.findFirst({
    where: { fromUserId, toUserId },
  });
};

export const createFriend = async (fromUserId, toUserId) => {
  return await prisma.friend.create({
    data: { fromUserId, toUserId },
  });
};

export const findFriendsByUserId = async (fromUserId) => {
  return await prisma.friend.findMany({
    where: { fromUserId },
    include: { toUser: true },
  });
};