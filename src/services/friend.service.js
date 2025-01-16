import { prisma } from "../db.config.js";


// 친구 추가 서비스
export const addFriendService = async (fromUserId, toUserId) => {
  // 이미 친구인지 확인
  const existingFriend = await prisma.friend.findFirst({
    where: {
      fromUserId: fromUserId, 
      toUserId: toUserId,     
    },
  });

  if (existingFriend) {
    throw new Error('이미 친구 관계가 존재합니다.');
  }

  // 친구 추가
  const newFriend = await prisma.friend.create({
    data: {
      fromUserId: fromUserId,
      toUserId: toUserId,
    },
  });

  return newFriend;
};


// 친구 목록 조회 서비스
export const getFriendsService = async (fromUserId) => {
  // 비즈니스 로직
  console.log(`Getting friends for user: ${fromUserId}`);
};