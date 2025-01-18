    export const bodyToComment = ({userId,comment, post }) => {
        if (!userId || typeof userId !== "number") {
            throw new Error("userId가 없습니다 또는 잘못된 타입입니다.");
        }
    return {
        userId,
        postId:post.id,
        content:comment.content,
        createdAt:comment.createdAt|| new Date(),
    };
};

    export const bodyToEditComment = ({userId,commentId,comment, post }) => {
    return{
        userId,
        commentId,
        postId:post.id,
        content:comment.content,
        updatedAt:comment.updatedAt || new Date(),
    };
};