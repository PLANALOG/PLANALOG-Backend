export const responseFromLike = ({ like }) => {
    return {
      id: like.id,
      userId: like.userId,
      postId: like.entityId,
      createdAt: like.createdAt,
    };
  };
  