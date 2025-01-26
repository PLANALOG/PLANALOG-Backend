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



import { countFollowers } from '../repositories/friend.repository.js';

export const getFriendCountService = async (userId) => {
  try {
    const followerCount = await countFollowers(userId); // 팔로워 수 조회
    return followerCount;
  } catch (error) {
    console.error('Service 에러 상세:', error);
    throw error;
  }
};

import { findFollowers, findFollowings } from "../repositories/friend.repository.js";

export const getFollowersService = async (userId, search) => {
  try {
    const followers = await findFollowers(userId, search);
    return formatFriends(followers);
  } catch (error) {
    console.error("Service 에러 (팔로워 조회):", error.message);
    throw error;
  }
};

export const getFollowingService = async (userId, search) => {
  try {
    const following = await findFollowings(userId, search);
    return formatFriends(following);
  } catch (error) {
    console.error("Service 에러 (팔로우 조회):", error.message);
    throw error;
  }
};

// src/services/friend.service.js

export const acceptFriendService = async (friendId, userId) => {
  const updatedFriend = await acceptFriendRequest(friendId, userId);
  if (!updatedFriend) {
    throw new Error("친구 요청을 처리할 수 없습니다.");
  }

  return updatedFriend;
};

