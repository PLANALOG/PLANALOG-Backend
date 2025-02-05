import { generateTokens } from "./auth.config.js";
import { prisma } from "./db.config.js"

export const testUserMiddleware = async (req, res, next) => {
    /*
        #swagger.summary = "로컬 테스트용 유저 생성 및 JWT 발급"
        #swagger.description = "이 API는 로컬 테스트 환경에서 사용할 유저를 데이터베이스에 추가하고, JWT 토큰을 발급합니다."
        #swagger.tags = ["Test"]

        #swagger.responses[200] = {
            description: "테스트 유저 생성 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            success: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "abc123.jwt.token" },
                                    refreshToken: { type: "string", example: "xyz456.jwt.token" },
                                    user: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 1 },
                                            email: { type: "string", example: "planalog@naver.com" },
                                            platform: { type: "string", example: "naver" },
                                            name: { type: "string", example: "유엠씨" },
                                            type: { type: "string", example: "category_user" },
                                            nickname: { type: "string", example: "플라니" },
                                            introduction: { type: "string", example: "추후 수정" },
                                            link: { type: "string", example: "추후 수정" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-30T12:34:56.789Z" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-30T12:34:56.789Z" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    */
    try {
        const testUserData = {
            email: "planalog@naver.com",
            platform: "naver",
            name: "유엠씨",
            nickname: "플라니",
            type: "category_user",
            introduction: "추후 수정",
            link: "추후 수정",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // DB에 테스트 유저 추가 (이미 있으면 추가 안 함)
        let user = await prisma.user.findUnique({ where: { email: testUserData.email } });

        if (!user) {
            user = await prisma.user.create({ data: testUserData });
        }

        // JWT 토큰 생성
        const { accessToken, refreshToken } = generateTokens(user);

        // 리프레시 토큰 저장
        await prisma.refreshToken.create({
            data: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
            },
        });

        return res.json({
            resultType: "SUCCESS",
            success: {
                accessToken,
                refreshToken,
                user,
            },
        });

    } catch (error) {
        console.error("테스트 유저 생성 오류:", error);
        return res.status(500).json({ message: "테스트 유저 생성 실패", error: error.message });
    }
}


