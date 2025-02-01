import { StatusCodes } from "http-status-codes";
import{bodyToLike, bodyToDeleteLike } from "../dtos/like.dto.js";
import {likeMoment, deleteMomentLike } from "../services/like.service.js";

export const handleLikeMoment = async (req, res, next) => {
 /*
  #swagger.tags = ['Likes']
  #swagger.summary = '좋아요 추가 API'
  #swagger.description = '지정된 Moment에 좋아요를 추가합니다.'
  #swagger.security = [{
    "bearerAuth": []
  }]    
  
  #swagger.parameters['momentId'] = {
    in: 'path',
    required: true,
    description: '좋아요를 추가할 Moment의 ID',
    schema: { type: 'integer' }
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            moment: {
              type: "object",
              properties: {
                id: { type: "integer", description: "Moment ID" },
                userId: { type: "integer", description: "Moment 작성자 ID" },
                entityType: { type: "string", default: "moment", description: "엔터티 유형" }
              },
              required: ["id", "userId"]
            }
          }
        },
        example: {
          moment: {
            id: 1,
            userId: 1,
            entityType: "moment"
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "좋아요 추가 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                likeId: { type: "integer", description: "생성된 좋아요 ID" },
                message: { type: "string", example: "좋아요가 성공적으로 추가되었습니다." }
              }
            }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "존재하지 않는 Moment",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "C001" },
                reason: { type: "string", example: "존재하지 않는 Moment입니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[409] = {
    description: "중복된 좋아요 요청",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "L001" },
                reason: { type: "string", example: "이미 존재하는 좋아요입니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/

   try{ 
    console.log("Like를 요청했습니다!");
    const like = await likeMoment(bodyToLike(req.body,req.user.id)); 
    res.status(StatusCodes.OK).success(like); 
  } catch (error) {
    next(error);
}
  };
  
export const handleDeleteLikeMoment =  async (req, res, next) =>{
 /*
  #swagger.tags = ['Likes']
  #swagger.summary = '좋아요 삭제 API'
  #swagger.description = '지정된 좋아요를 삭제합니다.'
  #swagger.security = [{
    "bearerAuth": []
  }]    
  
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            likeId: { type: "integer", description: "삭제할 좋아요의 ID" }
          },
          required: ["likeId"]
        },
      example: {
        like: {
          likeId: 123
          }
        }
      }
    }
  }

  #swagger.responses[200] = {
    description: "좋아요 삭제 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: { 
              type: "object", 
              properties: { message: { type: "string", example: "좋아요가 성공적으로 삭제되었습니다." } }
            }
          }
        }
      }
    }
  }

  #swagger.responses[400] = {
    description: "요청 데이터가 잘못됨 (likeId 누락)",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "L004" },
                reason: { type: "string", example: "likeId가 요청 데이터에 없습니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[404] = {
    description: "존재하지 않는 좋아요",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "L002" },
                reason: { type: "string", example: "존재하지 않는 좋아요입니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }

  #swagger.responses[403] = {
    description: "권한 없는 좋아요 삭제 시도",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "L003" },
                reason: { type: "string", example: "본인이 추가한 좋아요만 삭제할 수 있습니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
*/

  try{ 
  console.log("Like 삭제를 요청했습니다!");
  const like = await deleteMomentLike(bodyToDeleteLike(req.body), req.user.id);
  res.status(StatusCodes.OK).success(like);
  } catch (error) {
  next(error);
}
};