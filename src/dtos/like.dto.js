export const bodyToLike = ({ post }, userId) => {
  if (!post || typeof post.id === "undefined") {
    throw new Error("post 객체 또는 post.id가 없습니다.");
  }
  if (!post.userId) {
    throw new Error("post.userId가 없습니다. 좋아요를 받은 사용자를 지정해야 합니다.");
  }
    return {
      fromUserId: userId, // 변경: 쿼리에서 받은 userId 사용
      userId: post.userId,
      entityId: post.id, 
      entityType: post.entityType || "post", 
    };
    };  
 
    export const bodyToDeleteLike = ({ like }) => {
      if (!like?.likeId) {
        throw new Error("likeId가 누락되었습니다.");
      }
      return { likeId: like.likeId };
    };