// src/controllers/search.controller.js
import { searchUsersService, saveSearchRecordService } from "../services/search.service.js";
import { StatusCodes } from "http-status-codes";
import { deleteSearchRecordService } from "../services/search.service.js";
import { validateDeleteSearchRecordDTO } from "../dtos/search.dto.js";

export const searchUsers = async (req, res) => {
  try {
    console.log("사용자 검색 요청이 들어왔습니다!");

    const { query } = req.query; // 단일 검색어
    const userId = req.user?.id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    if (!query || query.trim() === "") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "검색어를 입력해야 합니다.",
      });
    }

    await saveSearchRecordService(userId, query);

    const users = await searchUsersService(userId, { nickname: query, name: query });

    res.status(StatusCodes.OK).json({
      message: "사용자 검색 성공",
      data: users,
    });
  } catch (error) {
    console.error("사용자 검색 중 에러:", error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 내부 오류",
      error: error.message,
    });
  }
};


export const saveSearchRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { content } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "사용자 ID가 필요합니다." });
    }

    const record = await saveSearchRecordService(userId, content);

    res.status(200).json({
      message: "검색 기록 저장 성공",
      data: record,
    });
  } catch (error) {
    console.error("검색 기록 저장 중 에러:", error.message);
    res.status(500).json({ message: error.message });
  }
};


import { getSearchRecordsService } from "../services/search.service.js";

export const getSearchRecords = async (req, res) => {
  try {
    console.log("검색 기록 조회 요청이 들어왔습니다!");

    const userId = req.user?.id;

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const records = await getSearchRecordsService(userId);

    res.status(StatusCodes.OK).json({
      message: "검색 기록 조회 성공",
      data: records,
    });
  } catch (error) {
    console.error("검색 기록 조회 중 에러:", error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "서버 내부 오류",
      error: error.message,
    });
  }
};




export const deleteSearchRecord = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { recordId } = req.params; 

    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "사용자 ID가 필요합니다.",
      });
    }

    const { recordId: validatedRecordId } = validateDeleteSearchRecordDTO(recordId);

    await deleteSearchRecordService(userId, validatedRecordId);

    res.status(StatusCodes.OK).json({
      message: "검색 기록 삭제 성공",
    });
  } catch (error) {
    console.error("검색 기록 삭제 중 에러:", error.message);

    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};


