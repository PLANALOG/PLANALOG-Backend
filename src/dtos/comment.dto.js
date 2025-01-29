    export const bodyToComment = ({comment},userId,postId) => {
    return {
        userId: userId,  
        postId:postId,
        content:comment.content,
        createdAt:comment.createdAt|| new Date(),
    };
};
    export const bodyToEditComment =  ({ comment }, userId, postId, commentId)  => {
        return {
            userId,
            postId,
            commentId,
            content: comment.content,
            updatedAt: comment.updatedAt || new Date(),
        };
    };
    export const bodyToDeleteComment = (userId, commentId) => {
        return{
            userId: parseInt(userId), // 문자열로 전달될 수 있으므로 정수로 변환
            commentId: parseInt(commentId),
        };
    };

    export const responseFromComments = (comments) =>{
        return{
            data: comments,
            pagination:{
                cursor: comments.length ? comments(comments.length - 1).id : null,
            },
        };
    };