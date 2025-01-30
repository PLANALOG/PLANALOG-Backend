import { StatusCodes } from 'http-status-codes'; // HTTP 상태 코드를 활용하기 위해 추가
import { prisma } from "../db.config.js";
import { addFriendService, getFriendsService } from '../services/friend.service.js';
import { getFriendCountService } from '../services/friend.service.js';
import { createFriendCountDTO } from '../dtos/friend.dto.js';
import { deleteFriendService } from "../services/friend.service.js";
import { deleteFriendDeleteDTO } from "../dtos/friend.dto.js";

export const addFriend = async (req, res) => {
  try {
    const fromUserId = req.query.userId; // 쿼리 파라미터에서 가져옴
    if (!fromUserId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        errorCode: "A001",
        reason: "userId 쿼리 파라미터가 필요합니다.",
      });
    }

    const { toUserId } = req.body;
    if (!toUserId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errorCode: "A002",
        reason: "toUserId는 필수 값입니다.",
      });
    }

    const result = await addFriendService(fromUserId, toUserId);
    res.status(StatusCodes.CREATED).json({
      message: "친구 요청이 성공적으로 생성되었습니다.",
      result,
    });
  } catch (error) {
    res.status(error.statusCode || StatusCodes.BAD_REQUEST).json({
      errorCode: error.errorCode || "unknown",
      reason: error.message || "알 수 없는 에러가 발생했습니다.",
      data: error.data || null,
    });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const userId = req.query.userId; 
    if (!userId) {
      return res.json({ message: "userId 쿼리 파라미터가 필요합니다." });
    }

    const { search } = req.query; 
    const followers = await getFollowersService(userId, search);

    res.json({ message: "팔로워 목록 조회 성공", data: followers });
  } catch (error) {
    console.error("팔로워 조회 중 에러:", error.message);
    res.json({
      errorCode: "F001",
      reason: "팔로워 목록 조회 중 에러가 발생했습니다.",
      data: null,
    });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.json({ message: "userId 쿼리 파라미터가 필요합니다." });
    }

    const { search } = req.query; 
    const following = await getFollowingService(userId, search);

    res.json({ message: "팔로우하는 사람 목록 조회 성공", data: following });
  } catch (error) {
    console.error("팔로우 조회 중 에러:", error.message);
    res.json({
      errorCode: "F002",
      reason: "팔로우 목록 조회 중 에러가 발생했습니다.",
      data: null,
    });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params; 
    const userId = req.query.userId;     

    if (!friendId || !userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        errorCode: "D001",
        reason: "friendId와 userId 쿼리 파라미터가 필요합니다.",
      });
    }

    const deleteDTO = deleteFriendDeleteDTO(friendId);
    const result = await deleteFriendService(deleteDTO.friendId, userId);

    res.status(StatusCodes.OK).json({
      message: "친구 삭제 성공",
      data: result,
    });
  } catch (error) {
    console.error("친구 삭제 중 에러:", error.message);
    res.status(error.statusCode || StatusCodes.BAD_REQUEST).json({
      errorCode: error.errorCode || "D002",
      reason: error.message || "친구 삭제 중 오류가 발생했습니다.",
      data: error.data || null,
    });
  }
};

export const getFriendCount = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.json({
        errorCode: 'USER001',
        reason: 'userId 쿼리 파라미터가 필요합니다.',
        data: null,
      });
    }

    const dto = createFriendCountDTO(userId);
    const friendCount = await getFriendCountService(dto.userId);

    return res.json({
      message: '팔로워 수 조회 성공',
      data: { friendCount },
    });
  } catch (error) {
    console.error('팔로워 수 조회 중 에러:', error.message);
    return res.json({
      errorCode: 'FRIEND001',
      reason: error.message,
      data: null,
    });
  }
};

export const acceptFriend = async (req, res) => {
  try {
    const { friendId } = req.params; 
    const userId = req.query.userId;

    if (!userId) {
      return res.json({
        errorCode: "AUTH001",
        reason: "userId 쿼리 파라미터가 필요합니다.",
      });
    }

    const result = await acceptFriendService(friendId, userId);

    if (!result) {
      return res.json({
        errorCode: "FRIEND001",
        reason: "권한이 없거나 유효하지 않은 요청입니다.",
      });
    }

    res.json({
      message: "친구 요청이 수락되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("친구 요청 수락 중 에러:", error.message);
    res.json({
      errorCode: "FRIEND002",
      reason: error.message,
    });
  }
};
