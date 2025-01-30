export const createSearchUsersDTO = (nickname, name) => {
  if (!nickname && !name) {
    throw new Error("닉네임이나 이름 중 하나는 반드시 입력해야 합니다.");
  }

  return {
    nickname: nickname?.trim() || null, 
    name: name?.trim() || null,         
  };
};

export const formatSearchRecords = (records) => {
  return records.map((record) => ({
    id: record.id,
    content: record.content,
    createdAt: record.createdAt,
  }));
};

export const validateDeleteSearchRecordDTO = (recordId) => {
  if (!recordId || isNaN(Number(recordId))) {
    throw new Error("유효한 검색 기록 ID가 필요합니다.");
  }

  return {
    recordId: BigInt(recordId),
  };
};
