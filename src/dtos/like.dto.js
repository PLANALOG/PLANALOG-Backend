export const bodyToLike = ({ like, post }) => {
    return {
      fromUserId: like.fromUserId, 
      entityId: post.id, 
      entityType: like.entityType || "post", 
    };
    };  

  export const bodyToDeleteLike = ({ like,post }) => {
    return {
      likeId: like.likeId,
      fromUserId: like.fromUserId,
      entityId: post.id,
    };
    }; 
 
    //사용자 요청 데이터 변환.반환값 추가 X