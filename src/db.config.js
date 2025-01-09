import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// export const prisma = new PrismaClient({ log: ["query"] }); - sql 쿼리 확인 가능 옵션 (필요시 사용) 