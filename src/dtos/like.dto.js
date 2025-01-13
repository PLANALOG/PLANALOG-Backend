export const bodyToLike = ({ like }) => {
    return {
      id: like.id,
      userId: like.userId,
      postId: like.entityId,
    };
    };
//export const bodyToDeleteLike = ({ like }) => {   

      
  