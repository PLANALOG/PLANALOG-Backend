// src/dtos/friend.dto.js

export const createFriendDto = (body) => {
  const { fromUserId, toUserId } = body;

  if (!fromUserId || !toUserId) {
    throw new Error('fromUserId와 toUserId는 필수 항목입니다.');
  }

  return { 
    userId: fromUserId, 
    friendId: toUserId
  };
};



export const formatFriends = (friends) => {
  return friends.map((friend) => ({
    friendId: friend.id,
    id: friend.toUser ? friend.toUser.id : friend.fromUser.id,
    name: friend.toUser ? friend.toUser.name : friend.fromUser.name,
    email: friend.toUser ? friend.toUser.email : friend.fromUser.email,
    nickname: friend.toUser ? friend.toUser.nickname : friend.fromUser.nickname,
    introduction: friend.toUser ? friend.toUser.introduction : friend.fromUser.introduction,
    link: friend.toUser ? friend.toUser.link : friend.fromUser.link,
    isAccepted: friend.isAccepted, 
  }));
};


export const deleteFriendDeleteDTO = (friendId) => {
  if (!friendId || isNaN(Number(friendId))) {
    throw new Error("유효한 friendId가 필요합니다.");
  }

  return {
    friendId: Number(friendId), 
  };
};



export const createFriendCountDTO = (userId) => {
  if (!userId || isNaN(Number(userId))) {
    throw new Error('유효한 사용자 ID가 필요합니다.');
  }

  return {
    userId: Number(userId),
  };
};