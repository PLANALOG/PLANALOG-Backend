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

// 모든 친구 목록 조회
export const findFriends = async (fromUserId) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: BigInt(fromUserId),
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


// 닉네임 및 이름으로 친구 검색
export const findFriendsByNickname = async (fromUserId, nickname) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: BigInt(fromUserId),
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

// 친구 삭제
export const deleteFriendDeleteDTO = (friendId) => {
  if (!friendId) {
    throw new Error("friend_id는 필수 항목입니다.");
  }

  return {
    friendId,
  };
};


// src/repositories/friend.repository.js
export const findMutualFriends = async (fromUserId) => {
  try {
    const userId = BigInt(fromUserId);

    const friendsFrom = await prisma.friend.findMany({
      where: { fromUserId: userId },
      select: { toUserId: true },
    });

    const friendsTo = await prisma.friend.findMany({
      where: { toUserId: userId },
      select: { fromUserId: true },
    });

    const fromIds = friendsFrom.map(f => Number(f.toUserId));
    const toIds = friendsTo.map(f => Number(f.fromUserId));
    
    const mutualFriends = fromIds.filter(id => toIds.includes(id));
        
    return mutualFriends;
  } catch (error) {
    console.error('Repository 에러 상세:', error);
    throw error;
  }
};