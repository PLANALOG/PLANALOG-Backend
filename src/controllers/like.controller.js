import { StatusCodes } from "http-status-codes";
import{bodyToLike, bodyToDeleteLike } from "../dtos/like.dto.js";
import {likePost, deletePostLike } from "../services/like.service.js";

export const handleLikePost = async (req, res, next) => {
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