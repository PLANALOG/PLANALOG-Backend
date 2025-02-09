    export const bodyToComment = ({comment},userId,momentId) => {
    return {
        userId:userId,  
        momentId:momentId,
        content:comment.content,
        createdAt:comment.createdAt|| new Date(),
    };
};
    export const bodyToEditComment =  ({ comment }, userId, momentId, commentId)  => {
        return {
            userId,
            momentId,
            commentId,
            content: comment.content,
            updatedAt: comment.updatedAt || new Date(),
        };
    };
    export const bodyToDeleteComment = (userId, commentId) => {
        return{
            userId: userId, 
            commentId: BigInt(commentId),
        };
    };

    export const responseFromComments = (comments) =>{
        return{
            data: comments,
            pagination:{
                cursor: comments.length > 0 ? comments[comments.length - 1].id : null,
            },
        };
    };