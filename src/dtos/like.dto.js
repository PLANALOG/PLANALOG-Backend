export const bodyToLike = ({ like, post }, user) => {
  if (!post || typeof post.id === "undefined") {
    throw new Error("post 객체 또는 post.id가 없습니다.");
  }
  if (!post.userId) {
    throw new Error("post.userId가 없습니다. 좋아요를 받은 사용자를 지정해야 합니다.");
  }
    return {
      fromUserId: user.id, // req.user에서 가져옴
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