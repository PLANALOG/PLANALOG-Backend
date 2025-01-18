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
    id: friend.toUser.id,
    name: friend.toUser.name,
    email: friend.toUser.email,
    introduction: friend.toUser.introduction,
    link: friend.toUser.link,
    nickname: friend.toUser.nickname,
  }));
};

export class FriendDeleteDTO {
  constructor(friendId) {
    if (!friendId) {
      throw new Error("Friend ID is required");
    }
    this.friendId = Number(friendId);
  }
}

