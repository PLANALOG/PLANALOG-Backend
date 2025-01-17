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