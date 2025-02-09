import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ✅ user 생성 (id는 자동 증가)
  const user = await prisma.user.create({
    data: {
      email: "testuser@example.com",
      name: "테스트 유저",
      nickname: "testnickname", // 필수 추가
      type: "memo_user", // ENUM 값 중 하나 (category_user | memo_user | null)
    }
  });

  // ✅ userId를 가져와 moment에 연결
  await prisma.moment.create({
    data: {
      title: "25년 1월7일",
      user: {
        connect: { id: user.id }, // 방금 만든 user와 연결
      },
      momentContents: {
        create: [
          {
            sortOrder: 1,
            content: "오늘 하루 열심히 공부했어요!",
            url: "https://image1.com/image1.jpg",
          },
        ],
      },
    },
  });

  console.log("✅ moment 데이터가 정상적으로 삽입되었습니다!");
}

main()
  .catch((e) => {
    console.error("❌ 데이터 삽입 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });