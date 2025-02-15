export const bodyToLike = ({ moment }, userId) => {
    return {
      fromUserId: userId,   
      userId: moment.userId, 
      entityId: moment.id, 
      entityType: moment.entityType || "moment", 
    };
    };  
 
    export const bodyToDeleteLike = ({ like }) => {
      return { likeId: like?.likeId };
    };