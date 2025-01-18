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

import { deleteFriendById } from "../repositories/friend.repository.js";

export const deleteFriendService = async (friendId) => {
  try {
    const deletedFriend = await deleteFriendById(friendId);

    if (!deletedFriend) {
      throw new Error("Friend not found");
    }

    return {
      message: "Friend deleted successfully",
      data: deletedFriend,
    };
  } catch (error) {
    throw new Error(error.message || "Failed to delete friend");
  }
};
