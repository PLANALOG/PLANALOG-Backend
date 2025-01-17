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

// export const findFriendsByUserId = async (fromUserId) => {
//   return await prisma.friend.findMany({
//     where: { fromUserId },
//     include: { toUser: true },
//   });
// };

export const findFriends = async (fromUserId) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: Number(fromUserId),
    },
    include: {
      toUser: {
        select: {
          id: true,
          name: true,
          email: true,
          introduction: true,
          link: true,
          nickname: true,
        },
      },
    },
  });
};

export const findFriendsByNickname = async (fromUserId, nickname) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: Number(fromUserId),
      OR: [
        { toUser: { nickname: { contains: nickname } } },
        { toUser: { name: { contains: nickname } } },
      ],
    },
    include: {
      toUser: {
        select: {
          id: true,
          name: true,
          email: true,
          introduction: true,
          link: true,
          nickname: true,
        },
      },
    },
  });
};
