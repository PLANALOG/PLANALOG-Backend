import { StatusCodes } from "http-status-codes";
import { bodyToComment, bodyToEditComment, bodyToDeleteComment } from "../dtos/comment.dto.js";
import { addUserComment, editUserComment, deleteUserComment,listComments } from "../services/comment.service.js";

export const handleAddComment = async (req, res, next) => {
    try{ 
      console.log("댓글 추가를 요청했습니다!");
      console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용 

      const commentData = bodyToComment(req.body); // 반환 객체 저장
      commentData.userId = req.user.id;           // 새 속성 추가

      const newComment = await addUserComment(commentData);
      res.status(StatusCodes.OK).success(newComment); 
    } catch (error) {
        next(error);
    }
      };

   export const handleEditComment = async (req, res, next) => {
    try{
      console.log("댓글 수정 기능 요청했습니다!");
      console.log("body:", req.body);
      const editData = bodyToEditComment(req.body);
      editData.userId = req.user.id; 
      const updatedComment = await editUserComment(editData);
      res.status(StatusCodes.OK).success(updatedComment); 
    } catch (error) {
      next(error);
  }
    };

    export const handleDeleteComment = async (req,res,next) => {
      try{
        console.log("댓글 삭제 기능 요청");   //내 게시물일경우 모두 삭제 가능?
        console.log("body:", req.body);
        const deleteData = bodyToDeleteComment(req.body);
        deleteData.userId =  req.user.id;
        const deleteComment = await deleteUserComment(deleteData);
        res.status(StatusCodes.OK).success(deleteComment); 
      } catch (error) {
        next(error);
    }
      };


      export const handleListComment = async (req, res, next) => {
        try {
            const postId = parseInt(req.params.postId);
            const cursor = req.query.cursor ? parseInt(req.query.cursor) : null;
            const comments = await listComments(postId, cursor);
            res.status(StatusCodes.OK).success(comments);
        } catch (error) {
            next(error);
        }
    };


      //닉네임, content,내가 댓글 등록할 수 있도록. 점 세개 클릭하면 수정 혹은 삭제. 내 게시물의 댓글이라면 삭제
//닉네임, 댓글 내용, 댓글 생성시간?, commentId-> 삭제 수정
//페이지네이션 그냥 스크롤 아님?
