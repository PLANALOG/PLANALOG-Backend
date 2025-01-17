import { StatusCodes } from 'http-status-codes'; // HTTP 상태 코드를 활용하기 위해 추가
import { prisma } from "../db.config.js";
import { addFriendService, getFriendsService } from '../services/friend.service.js';



export const addFriend = async (req, res) => {
  try {
    const fromUserId = req.user?.id; 
    if (!fromUserId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "사용자 인증이 필요합니다." });
    }

    const { toUserId } = req.body;
    if (!toUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "toUserId는 필수 값입니다." });
    }

    const result = await addFriendService(fromUserId, toUserId);
    res.status(StatusCodes.CREATED).json({ message: "Friend added successfully", result });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};



// 친구 목록 조회 핸들러
// src/controllers/friend.controller.js



export const getFriends = async (req, res) => {
  try {
    console.log("친구 목록 조회 요청이 들어왔습니다!");

    const { nickname } = req.query;
    const { userId } = req.params;

    // 서비스 호출
    const formattedFriends = await getFriendsService(userId, nickname);

    // 응답 반환
    res.status(StatusCodes.OK).json({
      message: "친구 목록 조회 성공",
      data: formattedFriends,
    });
  } catch (error) {
    console.error("친구 목록 조회 중 에러:", error.message);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
