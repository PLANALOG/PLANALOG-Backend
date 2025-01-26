// src/repositories/friend.repository.js
import { prisma } from "../db.config.js";


export const findExistingFriend = async (fromUserId, toUserId) => {
  return await prisma.friend.findFirst({
    where: { fromUserId, toUserId },
  });
};


export const createFriendRequest = async (fromUserId, toUserId) => {
  const existingFriend = await prisma.friend.findFirst({
    where: {
      fromUserId,
      toUserId,
      isAccepted: false,
    },
  });

  if (existingFriend) {
    return existingFriend; 
  }

  return await prisma.friend.create({
    data: {
      fromUserId,
      toUserId,
      isAccepted: false, 
    },
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
      isAccepted: true,
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
      isAccepted: true,
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


export const countFollowers = async (userId) => {
  try {
    const count = await prisma.friend.count({
      where: {
        toUserId: BigInt(userId),
        isAccepted: true, 
      },
    });

    return count;
  } catch (error) {
    console.error('Repository 에러 상세:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (friendId, userId) => {

  const friendRequest = await prisma.friend.findUnique({
    where: { id: friendId },
  });

  if (!friendRequest) {
    throw new Error("유효하지 않은 요청입니다. 친구 요청을 찾을 수 없습니다.");
  }

  if (friendRequest.toUserId !== BigInt(userId)) {
    
    throw new Error("권한이 없거나 유효하지 않은 요청입니다.");
  }

  return await prisma.friend.update({
    where: { id: friendId },
    data: { isAccepted: true },
  });
};



export const findFollowers = async (userId, search) => {
  return await prisma.friend.findMany({
    where: {
      toUserId: BigInt(userId),
      isAccepted: true,
      fromUser: {
        isDeleted: false, // 탈퇴하지 않은 유저만 포함
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nickname: { contains: search } },
          ],
        }),
      },
    },
    select: {
      id: true,
      fromUser: {
        select: {
          id: true,
          name: true,
          email: true,
          nickname: true,
          introduction: true,
          link: true,
        },
      },
    },
  });
};



export const findFollowings = async (userId, search) => {
  return await prisma.friend.findMany({
    where: {
      fromUserId: BigInt(userId),
      isAccepted: true,
      toUser: {
        isDeleted: false, // 탈퇴하지 않은 유저만 포함
        ...(search && {
          OR: [
            { name: { contains: search } },
            { nickname: { contains: search } },
          ],
        }),
      },
    },
    select: {
      id: true,
      toUser: {
        select: {
          id: true,
          name: true,
          email: true,
          nickname: true,
          introduction: true,
          link: true,
        },
      },
    },
  });
};
