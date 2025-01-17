import { StatusCodes } from "http-status-codes";
import{bodyToLike, bodyToDeleteLike } from "../dtos/like.dto.js";
import {likePost, deletePostLike } from "../services/like.service.js";

export const handleLikePost = async (req, res, next) => {
   /*
    #swagger.summary = '좋아요 추가 API';
    #swagger.parameters['postId'] = {
      in: 'path',
      required: true,
      description: '좋아요를 추가할 게시글의 ID',
      schema: { type: 'string' }
    };
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
                  fromUserId: { type: "string" },
                },
              },
              post: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  userId: { type: "string" },
                  entityType: { type: "string", default: "post" }
                }
              }
            }
          }
        }
      }
    };
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
                  likeId: { type: "string" },
                  message: { type: "string", example: "좋아요가 성공적으로 추가되었습니다." }
                }
              }
            }
          }
        }
      }
    };
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
                  errorCode: { type: "string", example: "L002" },
                  reason: { type: "string", example: "post.userId가 없습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
   try{ 
    console.log("Like를 요청했습니다!");
    console.log("body:", req.body); //값이 잘 들어오나 확인하기 위한 테스트용
    const like = await likePost(bodyToLike(req.body)); 
    res.status(StatusCodes.OK).success(like); 
  } catch (error) {
    next(error);
}
  };
  
export const handleDeleteLikePost =  async (req, res, next) =>{
  /*
    #swagger.summary = '좋아요 삭제 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              like: { type: "object",
                properties: {
                  likeId: { type: "string", description: "삭제할 좋아요의 ID" }
                }
              }
            }
          }
        }
      }
    };
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
    };
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
                  errorCode: { type: "string", example: "L002" },
                  reason: { type: "string", example: "likeId가 누락되었습니다." },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try{ 
  console.log("Like 삭제를 요청했습니다!");
  console.log("body:", req.body);
  const like = await deletePostLike(bodyToDeleteLike(req.body));
  res.status(StatusCodes.OK).success(like);
  } catch (error) {
  next(error);
}
};
  //클라이언트 요청 처리
  //배포 전 console.log 테스트용 제거