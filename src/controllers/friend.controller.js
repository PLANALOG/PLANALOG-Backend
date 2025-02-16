import { StatusCodes } from "http-status-codes";
import { createNoticeService } from "../services/notice.service.js";

import {
  addFriendService,
  getFriendsService,
  getFriendCountService,
  getFollowingService,
  getFollowersService,
  deleteFriendService,
  acceptFriendService
} from "../services/friend.service.js";
import {
  createFriendCountDTO,
  deleteFriendDeleteDTO
} from "../dtos/friend.dto.js";


export const addFriend = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '친구 추가 API'
  #swagger.description = `친구 요청을 보냅니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const fromUserId = req.user?.id;
    const { toUserId } = req.body;

    if (!fromUserId) {
      return res.error({
        errorCode: "AUTH001",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    if (!toUserId) {
      return res.error({
        errorCode: "FRIEND001",
        reason: "toUserId는 필수 값입니다.",
        data: null,
      });
    }

    // 친구 추가 로직 실행
    const result = await addFriendService(fromUserId, toUserId);

    // 📌 친구 요청을 받은 사용자에게 알림 생성
    await createNoticeService(fromUserId, toUserId, {
      message: "새로운 친구 요청이 도착했습니다!",
      entityType: "FRIEND",
      entityId: fromUserId, // 보낸 사람 ID를 entityId로 설정
    });

    res.status(StatusCodes.CREATED).success({
      message: "친구 요청이 성공적으로 생성되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("친구 추가 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND002",
      reason: "친구 요청 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const getFollowers = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '팔로워 목록 조회 API'
  #swagger.description = `내 팔로워 목록을 조회합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const userId = req.user?.id;
    const { search } = req.query;

    if (!userId) {
      return res.error({
        errorCode: "AUTH002",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const followers = await getFollowersService(userId, search);
    res.status(StatusCodes.OK).success({
      message: "팔로워 목록 조회 성공",
      data: followers,
    });
  } catch (error) {
    console.error("팔로워 목록 조회 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND003",
      reason: "팔로워 목록 조회 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const getFollowing = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '팔로우 목록 조회 API'
  #swagger.description = `내가 팔로우하는 사람들의 목록을 조회합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const userId = req.user?.id;
    const { search } = req.query;

    if (!userId) {
      return res.error({
        errorCode: "AUTH003",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const following = await getFollowingService(userId, search);
    res.status(StatusCodes.OK).success({
      message: "팔로우 목록 조회 성공",
      data: following,
    });
  } catch (error) {
    console.error("팔로우 목록 조회 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND004",
      reason: "팔로우 목록 조회 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const getFriendCount = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '친구 수 조회 API'
  #swagger.description = `내 친구 수를 조회합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.error({
        errorCode: "FRIEND005",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const dto = createFriendCountDTO(userId);
    const friendCount = await getFriendCountService(dto.userId);

    res.status(StatusCodes.OK).success({
      message: "친구 수 조회 성공",
      data: { friendCount },
    });
  } catch (error) {
    console.error("친구 수 조회 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND006",
      reason: "친구 수 조회 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const getFriendCountByUserId = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '특정 유저의 친구 수 조회 API'
  #swagger.description = `특정 사용자의 친구 수를 조회합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.error({
        errorCode: "FRIEND007",
        reason: "유저 ID가 필요합니다.",
        data: null,
      });
    }

    const dto = createFriendCountDTO(userId);
    const friendCount = await getFriendCountService(dto.userId);

    res.status(StatusCodes.OK).success({
      message: "특정 유저의 친구 수 조회 성공",
      data: { friendCount },
    });
  } catch (error) {
    console.error("친구 수 조회 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND008",
      reason: "친구 수 조회 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const acceptFriend = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '친구 요청 수락 API'
  #swagger.description = `친구 요청을 수락합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const { friendId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.error({
        errorCode: "AUTH004",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const result = await acceptFriendService(friendId, userId);

    if (!result) {
      return res.error({
        errorCode: "FRIEND009",
        reason: "권한이 없거나 유효하지 않은 요청입니다.",
        data: null,
      });
    }

    res.status(StatusCodes.OK).success({
      message: "친구 요청이 수락되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("친구 요청 수락 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND010",
      reason: "친구 요청 수락 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};
export const deleteFriend = async (req, res) => {
  /* 
  #swagger.tags = ['Friends']
  #swagger.summary = '친구 삭제 API'
  #swagger.description = `친구 관계를 삭제합니다.`
  #swagger.security = [{ "bearerAuth": [] }]
  */
  try {
    const { friendId } = req.params;
    const userId = req.user?.id;

    if (!friendId || !userId) {
      return res.error({
        errorCode: "FRIEND005",
        reason: "friendId와 사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const deleteDTO = deleteFriendDeleteDTO(friendId);
    await deleteFriendService(deleteDTO.friendId, userId);

    res.status(StatusCodes.OK).success({
      message: "친구 삭제 성공",
    });
  } catch (error) {
    console.error("친구 삭제 중 에러:", error.message);
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: "FRIEND006",
      reason: "친구 삭제 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

