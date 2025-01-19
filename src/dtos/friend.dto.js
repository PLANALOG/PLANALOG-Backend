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

// src/dtos/friend.dto.js
export const formatFriends = (friends) => {
  return friends.map((friend) => ({
    friendId: friend.id,
    id: friend.toUser.id,
    name: friend.toUser.name,
    email: friend.toUser.email,
    introduction: friend.toUser.introduction,
    link: friend.toUser.link,
    nickname: friend.toUser.nickname,
  }));
};


export const deleteFriendDeleteDTO = (friendId) => {
  if (!friendId) {
    throw new Error("friend_id는 필수 항목입니다.");
  }
  return {
    friendId,
  };
};


export const createFriendCountDTO = (userId) => {
  if (!userId || isNaN(Number(userId))) {
    throw new Error('유효한 사용자 ID가 필요합니다.');
  }

  return {
    userId: Number(userId), // Number로 변환
  };
};
