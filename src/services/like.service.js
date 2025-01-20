import {DuplicateLikePostError, PostIdNotFoundError, LikeIdNotExistError,LikeIdMissingError} from "../errors.js";
import {addPostLike, removePostLike} from "../repositories/like.repository.js";

 export const likePost = async (data) => {
    if (!data.entityId || !data.entityType || !data.userId) {
        throw new Error("entityId, entityType 또는 userId가 누락되었습니다.");
      }
      const postExists = await prisma.post.findUnique({
        where: { id: data.entityId },
      });
      if (!postExists) {
        throw new PostIdNotFoundError("존재하지 않는 게시글입니다.", { entityId: data.entityId });
      }

    const likePostId = await addPostLike({
//사용자가 입력한 정보를 담음 data 객체
        fromUserId: data.fromUserId,
        userId: data.userId, 
        entityId: data.entityId, 
        entityType: data.entityType 
    });

    if (!likePostId ){
        throw new DuplicateLikePostError("이미 존재하는 좋아요입니다.", data);
    }


    return {
        likeId: likePostId,
        message: "좋아요가 성공적으로 추가되었습니다.",
      };
    };

    export const deletePostLike = async (data, user) => {
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
      
        if (like.fromUserId !== user.id) {
          throw new LikeNotOwnedByUserError("본인이 추가한 좋아요만 삭제할 수 있습니다.", data);
        }
      
        await removePostLike({ likeId: data.likeId });
      };