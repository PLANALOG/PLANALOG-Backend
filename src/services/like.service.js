import {DuplicateLikePostError, LikePostIdNotExistError} from "../errors.js";
import { 
    addPostLike,
    removePostLike
 } from "../repositories/like.repository.js";

 export const likePost = async (data) => {
    const likePostId = await addPostLike({
//사용자가 입력한 정보를 담음 data 객체
        fromUserId: data.fromUserId,
        postId: data.postId,
    });

    if (likePostId ===null ){
        throw new DuplicateLikePostError("이미 존재하는 좋아요입니다.", data);
    }
}

 export const deletePostLike = async (data) => {
    const isDeleted = await removePostLike({
        likeId: data.likeId,
    });

    if (!isDeleted ){
        throw new LikePostIdNotExistError("존재하지 않는 좋아요입니다.", data);
    }
}