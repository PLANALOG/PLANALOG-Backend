import { StatusCodes } from "http-status-codes";
import{bodyToLike, bodyToDeleteLike } from "../dtos/like.dto.js";
import {likePost, deletePostLike } from "../services/like.service.js";

export const handleLikePost = async (req, res, next) => {
 /*
  #swagger.summary = '좋아요 추가 API'
  #swagger.description = '지정된 게시글에 좋아요를 추가합니다.'
  #swagger.parameters['postId'] = {
    in: 'path',
    required: true,
    description: '좋아요를 추가할 게시글의 ID',
    schema: { type: 'string' }
  }
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            post: {
              type: "object",
              properties: {
                id: { type: "string", description: "게시글 ID" },
                userId: { type: "string", description: "게시글 작성자 ID" },
                entityType: { type: "string", default: "post", description: "엔터티 유형" }
              }
            }
          }
        },
        example: {
          post: {
            id: "1",
            userId: "1",
            entityType: "post"
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
                likeId: { type: "string", description: "생성된 좋아요 ID" },
                message: { type: "string", example: "좋아요가 성공적으로 추가되었습니다." }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[400] = {
    description: "잘못된 요청 데이터",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "L004" },
                reason: { type: "string", example: "요청 데이터가 누락되었습니다." }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  }
  #swagger.responses[404] = {
    description: "존재하지 않는 게시글",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "C001" },
                reason: { type: "string", example: "존재하지 않는 게시글입니다." }
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
                errorCode: { type: "string", example: "L001" },
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
    console.log("body:", req.body); //값이 잘 들어오나 확인하기 위한 테스트용
    console.log("user:", req.user);
    const like = await likePost(bodyToLike(req.body,req.user)); 
    res.status(StatusCodes.OK).success(like); 
  } catch (error) {
    next(error);
}
  };
  
export const handleDeleteLikePost =  async (req, res, next) =>{
 /*
  #swagger.summary = '좋아요 삭제 API'
  #swagger.description = '지정된 좋아요를 삭제합니다.'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            like: {
              type: "object",
              properties: {
                likeId: { type: "string", description: "삭제할 좋아요의 ID" }
              }
            }
          }
        },
        example: {
          like: { likeId: "123" }
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
            success: { type: "object", example: { message: "좋아요가 성공적으로 삭제되었습니다." } }
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
                errorCode: { type: "string", example: "L004" },
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
                errorCode: { type: "string", example: "L002" },
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
                errorCode: { type: "string", example: "L003" },
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
  console.log("body:", req.body);
  const like = await deletePostLike(bodyToDeleteLike(req.body), req.user);
  res.status(StatusCodes.OK).success(like);
  } catch (error) {
  next(error);
}
};
  //클라이언트 요청 처리
  //배포 전 console.log 테스트용 제거