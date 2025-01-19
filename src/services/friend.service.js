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




export const deleteFriendService = async (friendId, userId) => {
  const friend = await prisma.friend.findFirst({
    where: {
      id: friendId,
      OR: [
        { fromUserId: userId }, 
        { toUserId: userId },   
      ],
    },
  });

  if (!friend) {
    throw new Error("삭제할 수 있는 친구 관계가 없거나 권한이 없습니다.");
  }

  return await prisma.friend.delete({
    where: { id: friendId },
  });
};



import { findMutualFriends } from '../repositories/friend.repository.js';

export const getFriendCountService = async (fromUserId) => {
  try {
    const mutualFriends = await findMutualFriends(fromUserId);
    return mutualFriends.length;
  } catch (error) {
    console.error('Service 에러 상세:', error);
    throw error;
  }
};