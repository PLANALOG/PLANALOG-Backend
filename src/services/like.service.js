import {DuplicateLikeMomentError, momentIdNotFoundError, LikeIdNotExistError,LikeIdMissingError} from "../errors.js";
import {addMomentLike, removeMomentLike} from "../repositories/like.repository.js";
import { prisma } from "../db.config.js"; 


 export const likeMoment = async (data) => {
    if (!data.entityId || !data.entityType || !data.userId) { 
        throw new Error("entityId, entityType 또는 userId가 누락되었습니다.");
      }
      const momentExists = await prisma.moment.findUnique({
        where: { id: data.entityId }, 
      });
      if (!momentExists) {
        throw new momentIdNotFoundError("존재하지 않는 게시글입니다.", { entityId: data.entityId }); 
      }

    const likeMomentId = await addMomentLike({
//사용자가 입력한 정보를 담음 data 객체
        fromUserId: data.fromUserId,
        userId: data.userId, 
        entityId: data.entityId, 
        entityType: data.entityType 
    });

    if (!likeMomentId ){
        throw new DuplicateLikeMomentError("이미 존재하는 좋아요입니다.", data);
    }

    return {
        likeId: likeMomentId,
        message: "좋아요가 성공적으로 추가되었습니다.",
      };
    };

    export const deleteMomentLike = async (data, userId) => {
    // 요청 데이터 유효성 검사
    if (!data?.likeId) {
        throw new LikeIdMissingError("likeId가 요청 데이터에 없습니다.", data);
    }
     // 데이터베이스에서 해당 좋아요 검색
        const like = await prisma.like.findUnique({
          where: { id: data.likeId },
        });
      
        if (!like) {
          throw new LikeIdNotExistError("존재하지 않는 좋아요입니다.", data);
        }
      
        if (like.fromUserId !== userId) {
          throw new LikeNotOwnedByUserError("본인이 추가한 좋아요만 삭제할 수 있습니다.", data);
        }
      
        await removeMomentLike({ likeId: data.likeId });
      };