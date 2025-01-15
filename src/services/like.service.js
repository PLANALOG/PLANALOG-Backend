import {DuplicateLikePostError, LikePostIdNotExistError} from "../errors.js";
import {addPostLike, removePostLike} from "../repositories/like.repository.js";

 export const likePost = async (data) => {
    if (!data.entityId || !data.entityType || !data.userId) {
        throw new Error("entityId, entityType 또는 userId가 누락되었습니다.");
      }

    const likePostId = await addPostLike({
//사용자가 입력한 정보를 담음 data 객체
        fromUserId: data.fromUserId,
        userId: data.userId, 
        entityId: data.entityId, 
        entityType: data.entityType 
    });

    if (likePostId ===null ){
        throw new DuplicateLikePostError("이미 존재하는 좋아요입니다.", data);
    }

    return {
        likeId: likePostId,
        message: "좋아요가 성공적으로 추가되었습니다.",
      };
    };

 export const deletePostLike = async (data) => {
    const isDeleted = await removePostLike({
        likeId: data.likeId,
    });

    if (!isDeleted ){
        throw new LikePostIdNotExistError("존재하지 않는 좋아요입니다.", data);
    }
}