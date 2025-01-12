import { StatusCodes } from "http-status-codes";
import{bodyToLike} from "../dtos/like.dto.js";
import {likePost} from "../services/like.service.js";

export const handleLikePost = async (req, res, next) => {
    console.log("Like를 요청하였습니다!");
    console.log("body:", req.body); 
  
    const like = await likePost(bodyToLike(req.body));
    res.status(StatusCodes.OK).json({ result: like });
  };
  아니 