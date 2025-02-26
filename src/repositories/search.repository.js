import { prisma } from "../db.config.js";

export const searchUsersByNicknameAndName = async (nickname, name) => {
  const filters = [];

  if (nickname) {
    filters.push({
      nickname: { contains: nickname.toLowerCase() },
    });
  }

  if (name) {
    filters.push({
      name: { contains: name.toLowerCase() },
    });
  }

  return await prisma.user.findMany({
    where: {
      OR: filters,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      introduction: true,
      link: true,
      nickname: true,
    },
  });
};



export const saveSearchRecord = async (userId, content) => {
  return await prisma.search.create({
    data: {
      userId: BigInt(userId),
      content,
    },
  });
};

export const getSearchRecords = async (userId) => {
  return await prisma.search.findMany({
    where: {
      userId: BigInt(userId),
    },
    orderBy: {
      createdAt: "desc", 
    },
  });
};

export const deleteSearchRecord = async (userId, recordId) => {
  // 삭제 전, 해당 검색 기록이 현재 사용자 소유인지 확인
  const record = await prisma.search.findUnique({
    where: {
      id: BigInt(recordId),
    },
  });

  if (!record || record.userId !== BigInt(userId)) {
    throw new Error("해당 검색 기록이 존재하지 않거나 권한이 없습니다.");
  }

  return await prisma.search.delete({
    where: {
      id: BigInt(recordId),
    },
  });
};