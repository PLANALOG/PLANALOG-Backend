import { prisma } from "../db.config.js";
import { findFriends, findFriendsByNickname } from "../repositories/friend.repository.js";
import { formatFriends } from "../dtos/friend.dto.js";


export const addFriendService = async (fromUserId, toUserId) => {
  const existingFriend = await prisma.friend.findFirst({
    where: {
      fromUserId: fromUserId, 
      toUserId: toUserId,     
    },
  });

  if (existingFriend) {
    throw new Error('이미 친구 관계가 존재합니다.');
  }

  const newFriend = await prisma.friend.create({
    data: {
      fromUserId: fromUserId,
      toUserId: toUserId,
    },
  });

  return newFriend;
};


export const getFriendsService = async (fromUserId, nickname) => {
  let friends;

  if (nickname) {
    friends = await findFriendsByNickname(fromUserId, nickname);
  } else {
    friends = await findFriends(fromUserId);
  }

  return formatFriends(friends); 
};




export const deleteFriendService = async (friendId) => {
  // 친구 관계 존재 여부 확인
  const friend = await prisma.friend.findUnique({
    where: { id: friendId },
  });

  if (!friend) {
    throw new Error("친구 관계가 존재하지 않습니다.");
  }

  return await prisma.friend.delete({
    where: { id: friendId },
  });
};


import { findMutualFriends } from '../repositories/friend.repository.js';

export const getFriendCountService = async (fromUserId) => {
  try {
    // 디버깅을 위한 로그
    console.log('Service에 전달된 ID:', fromUserId, typeof fromUserId);
    
    const mutualFriends = await findMutualFriends(fromUserId);
    return mutualFriends.length;
  } catch (error) {
    console.error('Service 에러 상세:', error);
    throw error;
  }
};