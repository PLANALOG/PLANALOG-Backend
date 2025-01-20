// src/services/search.service.js
import { saveSearchRecord, searchUsersByNicknameAndName,deleteSearchRecord,getSearchRecords } from "../repositories/search.repository.js";
import { formatSearchRecords } from "../dtos/search.dto.js";

export const searchUsersService = async (userId, { nickname, name }) => {
  let users;

  if (nickname || name) {
    // 닉네임 또는 이름으로 검색
    users = await searchUsersByNicknameAndName(nickname, name);
  } else {
    throw new Error("검색 조건이 없습니다.");
  }

  return formatUsers(users); // 데이터 포맷팅
};

// 데이터 포맷팅 함수
export const formatUsers = (users) => {
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    introduction: user.introduction,
    link: user.link,
    nickname: user.nickname,
  }));
};


export const saveSearchRecordService = async (userId, content) => {
  if (!content) {
    throw new Error("저장할 검색 내용이 없습니다.");
  }
  return await saveSearchRecord(userId, content);
};


export const getSearchRecordsService = async (userId) => {
  const records = await getSearchRecords(userId);
  return formatSearchRecords(records); 
};


export const deleteSearchRecordService = async (userId, recordId) => {
  return await deleteSearchRecord(userId, recordId);
};
