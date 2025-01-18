    export const bodyToComment = ({userId,comment, post }) => {
        if (!post || typeof post.id === "undefined") {
            throw new Error("post 객체 또는 post.id가 없습니다.");
          }
          if (!comment.content || typeof comment.content !== "string") {
            throw new Error("comment.content가 없습니다 또는 잘못된 타입입니다.");
        }
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