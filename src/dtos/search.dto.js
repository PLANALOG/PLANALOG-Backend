// src/dtos/search.dto.js
export const createSearchUsersDTO = (nickname, name) => {
  if (!nickname && !name) {
    throw new Error("닉네임이나 이름 중 하나는 반드시 입력해야 합니다.");
  }

  return {
    nickname: nickname?.trim() || null, // 닉네임이 있으면 공백 제거
    name: name?.trim() || null,         // 이름이 있으면 공백 제거
  };
};

// 검색 기록 데이터 포맷팅
export const formatSearchRecords = (records) => {
  return records.map((record) => ({
    id: record.id,
    content: record.content,
    createdAt: record.createdAt,
  }));
};

// 검색 기록 삭제를 위한 DTO
export const validateDeleteSearchRecordDTO = (recordId) => {
  if (!recordId || isNaN(Number(recordId))) {
    throw new Error("유효한 검색 기록 ID가 필요합니다.");
  }

  return {
    recordId: BigInt(recordId),
  };
};
