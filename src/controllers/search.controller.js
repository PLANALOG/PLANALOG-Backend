import { searchUsersService, saveSearchRecordService, deleteSearchRecordService, getSearchRecordsService } from "../services/search.service.js";
import { validateDeleteSearchRecordDTO } from "../dtos/search.dto.js";

export const searchUsers = async (req, res) => {
  /*
  #swagger.tags = ['Search']
  #swagger.summary = '사용자 검색 API'
  #swagger.security = [{ "bearerAuth": [] }]
  */

  try {
    const { query } = req.query;
    const userId = req.user?.id;

    if (!userId) {
      return res.error({
        errorCode: "USER001",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    if (!query || query.trim() === "") {
      return res.error({
        errorCode: "SEARCH001",
        reason: "검색어를 입력해야 합니다.",
        data: null,
      });
    }

    await saveSearchRecordService(userId, query);

    const users = await searchUsersService(userId, { nickname: query, name: query });

    return res.success({
      message: "사용자 검색 성공",
      data: users,
    });
  } catch (error) {
    return res.error({
      errorCode: "SERVER001",
      reason: "사용자 검색 중 서버 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const saveSearchRecord = async (req, res) => {
  /*
  #swagger.tags = ['Search']
  #swagger.summary = '검색 기록 저장 API'
  #swagger.security = [{ "bearerAuth": [] }]
  */

  try {
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.error({
        errorCode: "USER001",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const record = await saveSearchRecordService(userId, content);

    return res.success({
      message: "검색 기록 저장 성공",
      data: record,
    });
  } catch (error) {
    return res.error({
      errorCode: "SERVER001",
      reason: "검색 기록 저장 중 서버 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const getSearchRecords = async (req, res) => {
  /*
  #swagger.tags = ['Search']
  #swagger.summary = '검색 기록 조회 API'
  #swagger.security = [{ "bearerAuth": [] }]
  */

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.error({
        errorCode: "USER001",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const records = await getSearchRecordsService(userId);

    return res.success({
      message: "검색 기록 조회 성공",
      data: records,
    });
  } catch (error) {
    return res.error({
      errorCode: "SERVER001",
      reason: "검색 기록 조회 중 서버 오류가 발생했습니다.",
      data: error.message,
    });
  }
};

export const deleteSearchRecord = async (req, res) => {
  /*
  #swagger.tags = ['Search']
  #swagger.summary = '검색 기록 삭제 API'
  #swagger.security = [{ "bearerAuth": [] }]
  */

  try {
    const userId = req.user?.id;
    const { recordId } = req.params;

    if (!userId) {
      return res.error({
        errorCode: "USER001",
        reason: "사용자 인증 정보가 필요합니다.",
        data: null,
      });
    }

    const { recordId: validatedRecordId } = validateDeleteSearchRecordDTO(recordId);

    await deleteSearchRecordService(userId, validatedRecordId);

    return res.success({
      message: "검색 기록 삭제 성공",
    });
  } catch (error) {
    return res.error({
      errorCode: "DELETE001",
      reason: "검색 기록 삭제 중 오류가 발생했습니다.",
      data: error.message,
    });
  }
};
