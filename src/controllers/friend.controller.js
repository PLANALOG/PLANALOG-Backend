import { StatusCodes } from 'http-status-codes'; // HTTP 상태 코드를 활용하기 위해 추가
import { prisma } from "../db.config.js";
import { addFriendService, getFriendsService } from '../services/friend.service.js';
import { getFriendCountService } from '../services/friend.service.js';
import { createFriendCountDTO } from '../dtos/friend.dto.js';
import { deleteFriendService } from "../services/friend.service.js";
import { deleteFriendDeleteDTO } from "../dtos/friend.dto.js";

export const addFriend = async (req, res) => {
  try {
    const fromUserId = req.user?.id; // 로그인한 유저의 ID
    if (!fromUserId) {
      return res.status(StatusCodes.UNAUTHORIZED).error({
        errorCode: "A001",
        reason: "사용자 인증이 필요합니다.",
      });
    }

    const { toUserId } = req.body;
    if (!toUserId) {
      return res.status(StatusCodes.BAD_REQUEST).error({
        errorCode: "A002",
        reason: "toUserId는 필수 값입니다.",
      });
    }

    const result = await addFriendService(fromUserId, toUserId);
    res.status(StatusCodes.CREATED).success({
      message: "친구 요청이 성공적으로 생성되었습니다.",
      result,
    });
  } catch (error) {
    res.status(error.statusCode || StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "unknown",
      reason: error.message || "알 수 없는 에러가 발생했습니다.",
      data: error.data || null,
    });
  }
};



// 내가 팔로우하는 사람 목록 조회
import { getFollowersService, getFollowingService } from "../services/friend.service.js";

export const getFollowers = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.OK).json({
        message: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const { search } = req.query; // 검색어
    const followers = await getFollowersService(userId, search);

    res.status(StatusCodes.OK).json({
      message: "팔로워 목록 조회 성공",
      data: followers,
    });
  } catch (error) {
    console.error("팔로워 조회 중 에러:", error.message);
    res.status(StatusCodes.OK).json({
      message: "팔로워 목록 조회 중 에러가 발생했습니다.",
      data: null,
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(StatusCodes.OK).json({
        message: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const { search } = req.query; // 검색어
    const following = await getFollowingService(userId, search);

    res.status(StatusCodes.OK).json({
      message: "팔로우하는 사람 목록 조회 성공",
      data: following,
    });
  } catch (error) {
    console.error("팔로우 조회 중 에러:", error.message);
    res.status(StatusCodes.OK).json({
      message: "팔로우 목록 조회 중 에러가 발생했습니다.",
      data: null,
    });
  }
};




// export const getFriends = async (req, res) => {
//   try {
//     console.log("친구 목록 조회 요청이 들어왔습니다!");

//     const { nickname } = req.query;
//     const userId = req.user?.id; 

//     const formattedFriends = await getFriendsService(userId, nickname);

//     res.status(StatusCodes.OK).json({
//       message: "친구 목록 조회 성공",
//       data: formattedFriends,
//     });
//   } catch (error) {
//     console.error("친구 목록 조회 중 에러:", error.message);

//     res.status(StatusCodes.BAD_REQUEST).json({
//       message: error.message,
//     });
//   }
// };

export const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // URL에서 friendId 가져오기
    const userId = req.user?.id;     // userId

    if (!friendId || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).error({
        errorCode: "D001",
        reason: "friendId와 userId가 필요합니다.",
      });
    }

    // DTO를 통해 데이터 검증
    const deleteDTO = deleteFriendDeleteDTO(friendId);

    // Service 호출
    const result = await deleteFriendService(deleteDTO.friendId, userId);

    res.status(StatusCodes.OK).success({
      message: "친구 삭제 성공",
      data: result,
    });
  } catch (error) {
    console.error("친구 삭제 중 에러:", error.message);
    res.status(error.statusCode || StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "D002",
      reason: error.message || "친구 삭제 중 오류가 발생했습니다.",
      data: error.data || null,
    });
  }
};



// src/controllers/friend.controller.js

export const getFriendCount = async (req, res) => {
  try {
    const userId = req.user?.id; // 로그인한 사용자 ID
    if (!userId) {
      throw new Error('로그인한 사용자 정보가 필요합니다.');
    }

    const dto = createFriendCountDTO(userId);

    const friendCount = await getFriendCountService(dto.userId);

    res.status(StatusCodes.OK).json({
      message: '팔로워 수 조회 성공',
      data: { friendCount },
    });
  } catch (error) {
    console.error('팔로워 수 조회 중 에러:', error.message);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};


import { acceptFriendService } from "../services/friend.service.js";

export const acceptFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // URL에서 friendId 추출
    const userId = req.user?.id; // 로그인한 사용자 ID

    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "사용자 인증이 필요합니다." });
    }

    const result = await acceptFriendService(friendId, userId);

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "권한이 없거나 유효하지 않은 요청입니다." });
    }

    res.status(StatusCodes.OK).json({ message: "친구 요청이 수락되었습니다.", result });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
