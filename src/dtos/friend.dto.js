
// src/dtos/friend.dto.js

export const createFriendDto = (body) => {
  const { fromUserId, toUserId } = body;

  if (!fromUserId || !toUserId) {
    throw new Error('fromUserId와 toUserId는 필수 항목입니다.');
  }

  return { userId: fromUserId, friendId: toUserId };
};
