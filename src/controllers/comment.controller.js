import { StatusCodes } from "http-status-codes";
import { bodyToComment, bodyToEditComment, bodyToDeleteComment } from "../dtos/comment.dto.js";
import { addUserComment, editUserComment, deleteUserComment,listComments } from "../services/comment.service.js";

export const handleAddComment = async (req, res, next) => {
 /*
  #swagger.tags = ['Comments']
  #swagger.summary = '댓글 추가 API'
  #swagger.description = '지정된 Moment에 댓글을 추가합니다.'

  #swagger.security = [{
    "bearerAuth": []
  }]

  #swagger.parameters['momentId'] = {
    in: 'path',
    required: true,
    description: '댓글을 추가할 Moment의 ID',
    schema: { type: 'integer' }
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            comment: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "댓글 내용 (최대 500자)",
                  maxLength: 500,
                  example: "이것은 댓글 내용입니다."
                }
              },
              required: ["content"]
            }
          }
        },
        example: {
          comment: {
            content: "이것은 댓글 내용입니다."
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "좋아요 추가 성공"
  }


 #swagger.responses[400] = {
  description: "잘못된 요청 - 댓글 내용이 비어 있음 (C002)"

}

#swagger.responses[422] = {
  description: "잘못된 요청 - 댓글 내용이 500자를 초과함 (C005)"
}

#swagger.responses[404] = {
    description: "존재하지 않는 Moment",
  }   

#swagger.responses[500] = {
    description: "서버 내부 오류 또는 데이터베이스 오류"
  }

*/

    try{ 
      console.log("댓글 추가를 요청했습니다!");  
      const commentData = bodyToComment(req.body, req.user.id ,parseInt(req.params.momentId));         
      const newComment = await addUserComment(commentData);
      res.status(StatusCodes.OK).success(newComment); 
    } catch (error) {
        next(error);
    }
      };

   export const handleEditComment = async (req, res, next) => {
      /*
  #swagger.tags = ['Comments']
  #swagger.summary = '댓글 수정 API'
  #swagger.description = '지정된 게시글의 특정 댓글 내용을 수정합니다.'

  #swagger.security = [{
    "bearerAuth": []
  }]  

  #swagger.parameters['momentId'] = {
    in: 'path',
    required: true,
    description: '댓글이 속한 게시글 ID',
    schema: { type: 'integer' }
  }
  #swagger.parameters['commentId'] = {
    in: 'path',
    required: true,
    description: '수정할 댓글의 ID',
    schema: { type: 'integer' }
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            comment: {
              type: "object",
              properties: {
                content: { type: "string", description: "수정할 댓글 내용", example: "수정된 댓글 내용입니다." }
              }
            }
          }
        }
      }
    }
  }
   #swagger.responses[200] = {
    description: "댓글 수정 성공",
  }

#swagger.responses[400] = {
  description: "잘못된 요청 - 댓글 내용이 비어 있음 (C002)"
}

#swagger.responses[422] = {
  description: "잘못된 요청 - 댓글 내용이 500자를 초과함 (C005)"
}
    #swagger.responses[404] = {
      description: "존재하지 않는 댓글 또는 게시글"
    } 
    #swagger.responses[403] = {
      description: "권한 없음"
    }
    #swagger.responses[500] = {
      description: "서버 내부 오류 또는 데이터베이스 오류"
    }

  */ 
    try{
      console.log("댓글 수정 기능 요청했습니다!");
      const momentId = parseInt(req.params.momentId);
      const commentId = parseInt(req.params.commentId);
      const editData = bodyToEditComment(req.body, req.user.id, momentId, commentId); 
      const updatedComment = await editUserComment(editData);
      res.status(StatusCodes.OK).success(updatedComment); 
    } catch (error) {
      next(error);
  }
    };
   

    //댓글 삭제
    export const handleDeleteComment = async (req,res,next) => {
  /*
  #swagger.tags = ['Comments']        
  #swagger.summary = '댓글 삭제 API'
  #swagger.description = '지정된 댓글을 삭제합니다.'

  #swagger.security = [{
    "bearerAuth": []
  }]   
  
  #swagger.parameters['commentId'] = {
    in: 'path',
    required: true,
    description: '삭제할 댓글의 ID',
    schema: { type: 'integer' }
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            commentId: { type: "integer", description: "삭제할 댓글의 ID" }
          }
        },
        example: {
          commentId: 123
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "댓글 삭제 성공"
  }
  #swagger.responses[403] = {
    description: "권한 없음"
  }
  #swagger.responses[404] = {
    description: "존재하지 않는 댓글"
  }
    #swagger.responses[500] = {
    description: "서버 내부 오류 또는 데이터베이스 오류"
  }
  */

      try{
        console.log("댓글 삭제 기능 요청");   
        const deleteData = bodyToDeleteComment(req.user.id, req.params.commentId);
        const deleteComment = await deleteUserComment(deleteData);
        res.status(StatusCodes.OK).success(deleteComment); 
      } catch (error) {
        next(error);
    }
      };
     

      //댓글 목록 조회
      export const handleListComment = async (req, res, next) => {
        /*
  #swagger.tags = ['Comments']        
  #swagger.summary = '댓글 목록 조회 API'
  #swagger.description = '지정된 게시글의 댓글 목록을 조회합니다.'
  #swagger.parameters['momentId'] = {
    in: 'path',
    required: true,
    description: '댓글을 조회할 게시글의 ID',
    schema: { type: 'integer' }
  }
  #swagger.parameters['cursor'] = {
    in: 'query',
    required: false,
    description: '페이지네이션을 위한 커서 (마지막 댓글 ID)',
    schema: { type: 'integer', example: 10 }
  }
  #swagger.responses[200] = {
    description: "댓글 목록 조회 성공"
  }
  #swagger.responses[404] = {
    description: "존재하지 않는 게시글"
  }
    #swagger.responses[500] = {
    description: "서버 내부 오류 또는 데이터베이스 오류"
  }

  */
        try {
            const momentId = parseInt(req.params.momentId);
            const cursor = req.query.cursor ? parseInt(req.query.cursor) : undefined; //undefined처리
            const comments = await listComments(momentId, cursor);
            res.status(StatusCodes.OK).success(comments);
        } catch (error) {
            next(error);
        }
    };
 