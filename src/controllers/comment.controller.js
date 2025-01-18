import { StatusCodes } from "http-status-codes";
import { bodyToComment } from "../dtos/comment.dto.js";
import { addNewComment } from "../services/comment.service.js";

export const handleAddComment = async (req, res, next) => {
    try{ 
    console.log("댓글 추가를 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용 
    const comment = await addNewComment(bodyToComment(req.body));
    res.status(StatusCodes.OK).success(comment); 
      } catch (error) {
        next(error);
    }
      };