import { bodyToLike } from "../dtos/like.dto.js";
import { 
    addPostLike,
    removePostLike
 } from "../repositories/like.repository.js";

 export const likePost = async (data) => {
    const likePostId = await addPostLike({
//사용자가 입력한 정보를 담음 data 객체
        fromUserId: data.fromUserId,
        entityType: data.entityType,
        entityId: data.entityId,
    });

    if (likePostId ===null ){
        throw new Error("이미 존재하는 좋아요입니다.");
    }
    return responseFromLike({ likeId: likePostId });
 };
 //성공적으로 저장되면 새로운 like id 반환

 export const deletePostLike = async (data) => {
    const isDeleted = await removePostLike({
        likeId: data.likeId,
    });

    if (!isDeleted ){
        throw new Error("존재하지 않는 좋아요입니다.");
    }
    return responseFromLike({  likeId: data.likeId  });
 };
