    export const bodyToComment = ({comment, post }) => {
    return {

        postId:post.id,
        content:comment.content,
        createdAt:comment.createdAt|| new Date(),
    };
};
    export const bodyToEditComment = ({commentId,comment, post }) => {
    return{
        commentId,
        postId:post.id,
        content:comment.content,
        updatedAt:comment.updatedAt || new Date(),
    };
};
    export const bodyToDeleteComment =({ commentId,post}) => {
        return{
            commentId,
            postId:post.id,
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