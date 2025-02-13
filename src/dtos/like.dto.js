export const bodyToLike = ({ moment }, userId) => {
    return {
      fromUserId: userId,    //좋아요 누른 사람
      entityId: moment.id, 
      entityType: moment.entityType || "moment", 
    };
    };  
 
    export const bodyToDeleteLike = ({ like }) => {
      return { likeId: like?.likeId };
    };