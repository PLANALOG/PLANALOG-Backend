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


export const findFriends = async (fromUserId) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: Number(fromUserId),
    },
    select: {
      id: true, 
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
    select: {
      id: true, 
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







// 친구 삭제 레파지토리 함수
export const deleteFriendDeleteDTO = (friendId) => {
  if (!friendId) {
    throw new Error("friend_id는 필수 항목입니다.");
  }

  return {
    friendId,
  };
};
