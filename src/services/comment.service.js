import {PostIdNotFoundError,ContentNotFoundError} from "../errors.js";
import {addComment} from "../repositories/comment.repository.js";

export const addNewComment = async (data) =>{
    if (data.postId === null){
        throw new PostIdNotFoundError("존재하지 않는 게시글입니다.", data);
}
    if (!data.content || data.content.trim() === "") {
        throw new ContentNotFoundError("내용을 작성하지 않았습니다.", data);
    }

    const addNewCommentId = await addComment({
        userId: data.userId,
        postId: data.postId,
        content: data.content,
        createdAt: data.createdAt,
});
    return addNewCommentId;
};