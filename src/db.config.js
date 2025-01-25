import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// export const prisma = new PrismaClient({ log: ["query"] }); - sql 쿼리 확인 가능 옵션 (필요시 사용) 

/*let prisma; // PrismaClient 인스턴스를 저장할 변수

if (!global.prisma) {
    global.prisma = new PrismaClient({ log: ["query"] }); // 로그 옵션 포함
  }
  
  prisma = global.prisma;
  
  export { prisma }; // PrismaClient 인스턴스를 export
  */