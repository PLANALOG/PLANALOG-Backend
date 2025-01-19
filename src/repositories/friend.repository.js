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
// src/repositories/friend.repository.js
export const findMutualFriends = async (fromUserId) => {
  // 디버깅을 위한 로그
  console.log('Repository에 전달된 ID:', fromUserId, typeof fromUserId);
  
  try {
    // prisma 쿼리 실행 전 타입 확인
    const userId = BigInt(fromUserId);
    console.log('BigInt 변환 후:', userId);

    // friendsFrom 쿼리 실행 및 결과 확인
    const friendsFrom = await prisma.friend.findMany({
      where: { fromUserId: userId },
      select: { toUserId: true },
    });
    console.log('friendsFrom 결과:', friendsFrom);

    // friendsTo 쿼리 실행 및 결과 확인
    const friendsTo = await prisma.friend.findMany({
      where: { toUserId: userId },
      select: { fromUserId: true },
    });
    console.log('friendsTo 결과:', friendsTo);

    // 결과를 Number로 변환하여 처리
    const fromIds = friendsFrom.map(f => Number(f.toUserId));
    const toIds = friendsTo.map(f => Number(f.fromUserId));
    
    // 교집합 계산
    const mutualFriends = fromIds.filter(id => toIds.includes(id));
    console.log('상호 친구 수:', mutualFriends.length);
    
    return mutualFriends;
  } catch (error) {
    console.error('Repository 에러 상세:', error);
    throw error;
  }
};