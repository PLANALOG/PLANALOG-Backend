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

export const getFriends = async (req, res) => {
  try {
    console.log("친구 목록 조회 요청이 들어왔습니다!");

    const { nickname } = req.query;
    const { userId } = req.params;

    const formattedFriends = await getFriendsService(userId, nickname);

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

import { deleteFriendService } from "../services/friend.service.js";
import { deleteFriendDeleteDTO } from "../dtos/friend.dto.js";


export const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // URL에서 friend_id 가져오기
    

    const deleteDTO = deleteFriendDeleteDTO(friendId); // DTO로 검증 및 객체 생성

    const result = await deleteFriendService(deleteDTO.friendId); // 서비스 호출

    res.status(StatusCodes.OK).json({
      message: "친구 삭제 성공",
      data: result,
    });
  } catch (error) {
    console.error("친구 삭제 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

// src/controllers/friend.controller.js
import { getFriendCountService } from '../services/friend.service.js';
import { createFriendCountDTO } from '../dtos/friend.dto.js';

export const getFriendCount = async (req, res) => {
  try {
    const fromUserId = req.user?.id;
    if (!fromUserId) {
      throw new Error('로그인한 사용자 정보가 필요합니다.');
    }

    // DTO 생성 및 검증
    const dto = createFriendCountDTO(fromUserId);
    
    // 서비스 호출
    const friendCount = await getFriendCountService(dto.userId);

    res.status(200).json({
      message: '친구 수 조회 성공',
      data: { friendCount },
    });
  } catch (error) {
    console.error('친구 수 조회 중 에러:', error.message);
    res.status(400).json({
      message: error.message,
    });
  }
};