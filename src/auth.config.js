import dotenv from "dotenv";
import { prisma } from "./db.config.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { validationError } from "./validator.js";
import { InvalidOrExpiredTokenError, InvalidSocialAccessTokenError, InvalidSocialRefreshTokenError, MissingAuthorizationHeaderError, UserWithOtherPlatformError } from "./errors.js";
import { platform } from "os";

dotenv.config();

// JWT 비밀 키
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// JWT 생성 함수
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" } // 토큰 만료 시간 설정 (1시간)
    );
};

//액세스 토큰과 리프레시 토큰 발급 함수 
export const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // 액세스 토큰 만료 시간 1시간 
    );

    const refreshToken = crypto.randomBytes(64).toString("hex"); // 랜덤 리프레시 토큰 생성

    return { accessToken, refreshToken };
};

// JWT 인증 미들웨어
export const authenticateJWT = (req, res, next) => {
    console.log("JWT 토큰 인증 미들웨어 실행")
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1]; // 'Bearer <token>'에서 <token> 추출
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                throw new InvalidOrExpiredTokenError();
            }
            req.user = user; // 사용자 정보 추가
            next();
        });
    } else {
        throw new MissingAuthorizationHeaderError();
    }
};


//카카오 연결끊기
export const kakaoDisconnect = async (refreshToken) => {
    // 유저의 refreshToken으로 소셜서버에 accessToken 요청 
    const newToken = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_CLIENT_ID,
        refresh_token: refreshToken,
        client_secret: process.env.KAKAO_CLIENT_SECRET
    },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }
    ).catch(error => { //에러응답 반환 시 throw 에러 
        throw new Error(`카카오 액세스 토큰 갱신 실패 : ${error.response?.data?.error} - ${error.response?.data?.error_description}`)
    });

    console.log("토큰 갱신 성공", newToken.data);

    const accessToken = newToken.data.access_token;

    // 액세스토큰으로 연결 끊기 요청 
    const userIdInKakao = await axios.post('https://kapi.kakao.com/v1/user/unlink', {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch(error => { //에러응답 반환 시 throw 에러 
        throw new Error(`카카오 연결 끊기 실패 : ${error.response?.data?.error} - ${error.response?.data?.error_description}`)
    });

    console.log("카카오 연결 끊기 성공", userIdInKakao.data.id);
}


//구글 연결끊기
export const googleDisconnect = async (refreshToken) => {

    console.log("구글 연결 끊기를 요청했습니다.");

    // 유저의 refreshToken으로 소셜서버에 accessToken 요청 
    const newToken = await axios.post('https://oauth2.googleapis.com/token', {
        grant_type: "refresh_token",
        client_id: process.env.GOOGLE_CLIENT_ID,
        refresh_token: refreshToken,
        client_secret: process.env.GOOGLE_CLIENT_SECRET
    },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }
    ).catch(error => { //에러응답 반환 시 throw 에러 
        throw new Error(`구글 액세스 토큰 갱신 실패 : ${error.response?.data?.error} - ${error.response?.data?.error_description}`)
    });

    console.log('토큰 갱신 성공', newToken.data);

    const accessToken = newToken.data.access_token;


    // 액세스토큰으로 연결 끊기 요청
    const result = await axios.post(
        `https://oauth2.googleapis.com/revoke?token=${accessToken}`
    ).catch(error => { //에러응답 반환 시 throw 에러 
        throw new Error(`구글 연결 끊기 실패 : ${error.response?.data?.error} - ${error.response?.data?.error_description}`)
    });

    console.log('구글 연결 끊기 성공', result.status);

}

// 네이버 연결 끊기
export const naverDisconnect = async (refreshToken) => {

    // 유저의 refreshToken으로 소셜서버에 accessToken 요청 
    const newToken = await axios.post(`https://nid.naver.com/oauth2.0/token`, null, {
        params: {
            grant_type: 'refresh_token',
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            refresh_token: refreshToken
        }
    })

    // 액세스토큰 API 요청 데이터가 잘못된 경우
    // client id/ secret이 잘못되지 않는 한 리프레시토큰이 유효하지 않은 경우 발생하므로 
    // 유효하지 않거나 만료된 리프레시 토큰 에러 발생 
    // 네이버는 에러응답대신 성공응답에 error data를 포함하여 보내므로 catch대신 if문으로 처리 
    if (newToken.data.error === "invalid_request" && newToken.data.error_description === "invalid client_info" ||
        newToken.data.error === "invalid_grant") {
        throw new InvalidSocialRefreshTokenError("naver");
    }

    // invalid_request 가 아닌 다른 에러로 실패한 경우 
    if (newToken?.data?.error) {
        throw new Error(`네이버 액세스 토큰 갱신 실패 : ${newToken.data.error} - ${newToken.data.error_description}`)
    }

    console.log('토큰 갱신 성공', newToken.data);

    const accessToken = newToken.data.access_token;

    // 액세스토큰으로 연결 끊기 요청
    const userIdInNaver = await axios.post(`https://nid.naver.com/oauth2.0/token`, null, {
        params: {
            grant_type: 'delete',
            client_id: process.env.NAVER_CLIENT_ID,
            client_secret: process.env.NAVER_CLIENT_SECRET,
            access_token: accessToken
        }
    });

    // 연결 끊기 요청이 실패한 경우 
    if (userIdInNaver?.data?.error) {
        throw new Error(`네이버 연결 끊기 실패 : ${userIdInNaver.data.error} - ${userIdInNaver.data.error_description}`)
    }

    console.log('네이버 연결 끊기 성공', userIdInNaver.data.result);

}


// 네이버 액세스 토큰 받아서 로그인 구현
export const handleNaverTokenLogin = async (req, res, next) => {
    /*
        #swagger.summary = '네이버 액세스 토큰을 이용한 로그인'
        #swagger.description = '로그인 또는 인증 과정에서 액세스 토큰과 리프레시 토큰을 발급받습니다.'
        #swagger.tags = ["Users"]
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        accessToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        },
                        refreshToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        }
                    },
                    required: ["accessToken"]
                }
            }
        }
    }
        #swagger.responses[200] = {
            description: "토큰 발급 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "abc123.jwt.token" },
                                    refreshToken: { type: "string", example: "xyz456.refresh.token" }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
        description: "잘못된 요청 - 다른 플랫폼으로 가입한 계정이 존재함",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        message: { 
                            type: "string", 
                            example: "다른 플랫폼으로 가입한 계정이 존재합니다." 
                        }
                    }
                }
            }
        }
    }
    */

    //유효성 검사 에러 반환
    validationError(req);

    const { accessToken: socialAccessToken, refreshToken: socialRefreshToken } = req.body;

    try {
        // 네이버 API를 사용하여 유저 정보 요청
        const naverUser = await axios.get("https://openapi.naver.com/v1/nid/me", {
            headers: { Authorization: `Bearer ${socialAccessToken}` },
        });

        const email = naverUser.data.response?.email;
        if (!email) {
            throw new InvalidSocialAccessTokenError("naver");
        }

        // DB에서 사용자 조회 또는 새로 생성
        let user = await prisma.user.findFirst({ where: { email } });
        if (user && user.platform !== "naver") {
            throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform });
        }

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    platform: "naver",
                    name: naverUser.data.response?.name,
                    nickname: "추후 수정",
                    type: "null",
                    introduction: "추후 수정",
                    link: "추후 수정",
                    socialRefreshToken, // 소셜 리프레시 토큰 저장
                },
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { socialRefreshToken }, // 기존 유저의 소셜 리프레시 토큰 업데이트
            });
        }

        // JWT 발급
        const { accessToken, refreshToken } = generateTokens(user);

        // JWT 리프레시 토큰 저장
        await prisma.refreshToken.upsert({
            where: { userId: user.id },
            update: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.success({ accessToken, refreshToken });

    } catch (error) {
        return res.status(500).json({ message: "OAuth 검증 실패", error: error.message });
    }
}

// 카카오 액세스 토큰 받아서 로그인 구현
export const handleKakaoTokenLogin = async (req, res, next) => {
    /*
        #swagger.summary = '카카오 액세스 토큰을 이용한 로그인'
        #swagger.description = '네이티브 앱에서 카카오 액세스 토큰을 받아와 JWT를 발급하는 API입니다.'
        #swagger.tags = ["Users"]
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        accessToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        },
                        refreshToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        }
                    },
                    required: ["accessToken"]
                }
            }
        }
    }
        #swagger.responses[200] = {
            description: "카카오 로그인 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "abc123.jwt.token" },
                                    refreshToken: { type: "string", example: "xyz456.refresh.token" }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
        description: "잘못된 요청 - 다른 플랫폼으로 가입한 계정이 존재함",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        message: { 
                            type: "string", 
                            example: "다른 플랫폼으로 가입한 계정이 존재합니다." 
                        }
                    }
                }
            }
        }
    }
    */

    //유효성 검사 에러 반환
    validationError(req);

    const { accessToken: socialAccessToken, refreshToken: socialRefreshToken } = req.body;

    try {
        // 카카오 API를 사용하여 유저 정보 요청
        const kakaoUser = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: { Authorization: `Bearer ${socialAccessToken}` },
        });

        // 카카오에서 받은 유저 정보 확인
        const email = kakaoUser.data.kakao_account?.email;
        if (!email) {
            throw new InvalidSocialAccessTokenError("kakao");
        }

        // DB에서 사용자 조회
        let user = await prisma.user.findFirst({ where: { email } });

        // 만약 유저가 존재하지만, 카카오가 아닌 다른 플랫폼으로 가입했으면 에러 반환
        if (user && user.platform !== "kakao") {
            throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform });
        }

        // 유저가 없으면 새로 생성
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    platform: "kakao",
                    name: kakaoUser.data.properties?.nickname || "Unknown",
                    nickname: "추후 수정",
                    type: "null",
                    introduction: "추후 수정",
                    link: "추후 수정",
                    socialRefreshToken
                },
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { socialRefreshToken }, // 기존 유저라면 업데이트
            });
        }

        // 새로운 JWT 및 리프레시 토큰 발급
        const { accessToken, refreshToken } = generateTokens(user);

        // 리프레시 토큰을 DB에 저장 (기존 데이터가 있으면 업데이트)
        await prisma.refreshToken.upsert({
            where: { userId: user.id }, // userId가 존재하면 업데이트
            update: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.success({ accessToken, refreshToken });

    } catch (error) {
        return res.status(500).json({ message: "OAuth 검증 실패", error: error.message });
    }
};


export const handleGoogleTokenLogin = async (req, res, next) => {
    /*
        #swagger.summary = '구글 액세스 토큰을 이용한 로그인'
        #swagger.description = '네이티브 앱에서 구글 액세스 토큰을 받아와 JWT를 발급하는 API입니다.'
        #swagger.tags = ["Users"]
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        accessToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        },
                        refreshToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        }
                    },
                    required: ["accessToken"]
                }
            }
        }
    }
        #swagger.responses[200] = {
            description: "구글 로그인 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "abc123.jwt.token" },
                                    refreshToken: { type: "string", example: "xyz456.refresh.token" }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
        description: "잘못된 요청 - 다른 플랫폼으로 가입한 계정이 존재함",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        message: { 
                            type: "string", 
                            example: "다른 플랫폼으로 가입한 계정이 존재합니다." 
                        }
                    }
                }
            }
        }
    }
    */

    //유효성 검사 에러 반환
    validationError(req);

    const { accessToken: socialAccessToken, refreshToken: socialRefreshToken } = req.body;

    try {
        // 구글 API를 사용하여 유저 정보 요청
        const googleUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${socialAccessToken}` },
        });

        // 구글에서 받은 유저 정보 확인
        const email = googleUser.data.email;
        if (!email) {
            throw new InvalidSocialAccessTokenError("google");
        }

        // DB에서 사용자 조회
        let user = await prisma.user.findFirst({ where: { email } });

        // 만약 유저가 존재하지만, 구글이 아닌 다른 플랫폼으로 가입했으면 에러 반환
        if (user && user.platform !== "google") {
            throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform });
        }

        // 유저가 없으면 새로 생성, 있으면 소셜 리프레시 토큰 업데이트
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    platform: "google",
                    name: googleUser.data.name || "Unknown",
                    nickname: "추후 수정",
                    type: "null",
                    introduction: "추후 수정",
                    link: "추후 수정",
                    socialRefreshToken, // 소셜 리프레시 토큰 저장
                },
            });
        } else {
            await prisma.user.update({
                where: { id: user.id },
                data: { socialRefreshToken }, // 기존 유저의 소셜 리프레시 토큰 업데이트
            });
        }

        // JWT 발급
        const { accessToken, refreshToken } = generateTokens(user);

        // JWT 리프레시 토큰 저장
        await prisma.refreshToken.upsert({
            where: { userId: user.id },
            update: {
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
                userId: user.id,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        res.success({ accessToken, refreshToken });

    } catch (error) {
        return res.status(500).json({ message: "OAuth 검증 실패", error: error.message });
    }
};


export const handleRefreshToken = async (req, res, next) => {
    /*
        #swagger.summary = '액세스 토큰 재발급 및 리프레시 토큰 갱신 API'
        #swagger.description = '리프레시 토큰을 이용해 액세스 토큰을 재발급 받습니다. 만약 리프레시토큰의 만료일이 2일 이하라면 리프레시토큰도 재발급합니다다'
        #swagger.tags = ["Users"]
        #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        refreshToken: { 
                            type: "string", 
                            example: "abc123.jwt.token" 
                        }
                    },
                    required: ["refreshToken"]
                }
            }
        }
    }
        #swagger.responses[200] = {
            description: "액세스 토큰 재발급 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: {
                                type: "object",
                                properties: {
                                    accessToken: { type: "string", example: "abc123.jwt.token" },
                                    refreshToken: { type: "string", example: "xyz456.refresh.token" }
                                }
                            }
                        }
                    }
                }
            }
        }
    */

    //유효성 검사 에러 반환
    validationError(req);

    const { refreshToken } = req.body;

    // DB에서 리프레시 토큰 확인
    const storedToken = await prisma.refreshToken.findFirst({ where: { token: refreshToken } });

    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
        //만료된 리프레시 토큰 삭제 
        if (storedToken) {
            await prisma.refreshToken.delete({ where: { token: refreshToken } });
        }
        throw new InvalidOrExpiredTokenError();
    };

    // 유저 정보 가져오기
    const user = await prisma.user.findFirst({ where: { id: storedToken.userId } });

    // 새로운 액세스 토큰 발급
    const newAccessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    // 리프레시 토큰 만료까지 남은 시간이 2일 이하라면 새로 발급
    let newRefreshToken = refreshToken;
    const timeLeft = (new Date(storedToken.expiresAt) - new Date()) / (1000 * 60 * 60 * 24); // 남은 시간(일)

    if (timeLeft <= 2) {
        newRefreshToken = crypto.randomBytes(64).toString("hex"); // 새 리프레시 토큰 발급

        // 기존 리프레시 토큰을 새 토큰으로 업데이트
        await prisma.refreshToken.update({
            where: { token: refreshToken },
            data: {
                token: newRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 새 만료 기한 설정 (7일 후)
            },
        });
    }

    return res.success({ accessToken: newAccessToken, refreshToken: newRefreshToken });
}