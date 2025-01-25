import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver";
import { prisma } from "./db.config.js";
import { UserWithOtherPlatformError } from "./errors.js";
import axios from "axios";
import { isDeletedUser } from "./repositories/user.repository.js";

dotenv.config();

const verify = async (profile, email, platform, refreshToken) => {

    console.log(refreshToken)

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        await isDeletedUser(user.id);
        // 해당 이메일을 가진 유저가 있을 떄 
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 같으면 => 로그인 (return)
        if (user.platform === platform) return { id: user.id, email: user.email, name: user.name, refreshToken: refreshToken };
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 다르면 => 에러반환 (with 플랫폼) 
        else throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform })
    }

    const created = await prisma.user.create({
        data: {
            email,
            platform,
            name: profile.displayName,
            nickname: "추후 수정",
            type: "null",
            introduction: "추후 수정",
            link: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name, refreshToken: refreshToken };
};

//구글 로그인 
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://15.164.83.14:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        console.log(refreshToken);
        console.log(accessToken);

        return googleVerify(profile, accessToken)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);


const googleVerify = async (profile, accessToken) => {

    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (user !== null) {
        await isDeletedUser(user.id);
        // 해당 이메일을 가진 유저가 있을 떄 
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 같으면 => 로그인 (return)
        if (user.platform === "google") return { id: user.id, email: user.email, name: user.name, accessToken: accessToken };
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 다르면 => 에러반환 (with 플랫폼) 
        else throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform })
    }

    const created = await prisma.user.create({
        data: {
            email,
            platform: "google",
            name: profile.displayName,
            nickname: "추후 수정",
            type: "null",
            introduction: "추후 수정",
            link: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name, accessToken: accessToken };
};


// 카카오 로그인 
export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
        callbackURL: "http://15.164.83.14:3000/oauth2/callback/kakao",
    },
    (accessToken, refreshToken, profile, cb) => {
        const email = profile._json.kakao_account?.email;
        if (!email) {
            throw new Error(`profile._jaon.kakao_account?.email was not found: ${profile}`);
        }

        return verify(profile, email, "kakao", refreshToken)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

// 네이버 로그인 
export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        callbackURL: "http://15.164.83.14:3000/oauth2/callback/naver",
    },
    (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new Error(`profile.email was not found: ${profile}`);
        }

        console.log('refreshToken', refreshToken);

        return verify(profile, email, "naver", refreshToken)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);


//카카오 연결끊기
export const kakaoDisconnect = async (userId, refreshToken) => {
    // 유저의 refreshToken으로 소셜서버에 accessToken 요청 
    const newToken = await axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'refresh_token',
        client_id: process.env.PASSPORT_KAKAO_CLIENT_ID,
        refresh_token: refreshToken,
        client_secret: process.env.PASSPORT_KAKAO_CLIENT_SECRET
    },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }
    )
    if (!newToken) throw new Error('토큰 갱신에 실패했습니다.');
    console.log('토큰 갱신 성공', newToken.data);

    // 만약 리프레시 토큰도 갱신되었다면, session 테이블의 리프레시 토큰도 갱신해준다.
    if (newToken.data.refresh_token) {
        await prisma.session.update({
            where: { data: { id: userId } },
            data: { refreshToken: newToken.data.refresh_token }
        })
    }

    const accessToken = newToken.data.access_token;


    // 액세스토큰으로 연결 끊기 요청 
    const userIdInKakao = await axios.post('https://kapi.kakao.com/v1/user/unlink', {}, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    console.log('카카오 연결 끊기 성공', userIdInKakao.data.id);
}


//구글 연결끊기
export const googleDisconnect = async (userId, accessToken) => {

    console.log('구글 연결 끊기를 요청했습니다.');


    // 액세스토큰으로 연결 끊기 요청
    const result = await axios.post(
        `https://oauth2.googleapis.com/revoke?token=${accessToken}`

    ).catch((err) => { throw new Error(`구글 연결 끊기 실패 ${err.code}`) });

    console.log('구글 연결 끊기 성공', result.status);

}

// 네이버 연결 끊기
export const naverDisconnect = async (userId, refreshToken) => {

    // 유저의 refreshToken으로 소셜서버에 accessToken 요청 
    const newToken = await axios.post(`https://nid.naver.com/oauth2.0/token`, null, {
        params: {
            grant_type: 'refresh_token',
            client_id: process.env.PASSPORT_NAVER_CLIENT_ID,
            client_secret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
            refresh_token: refreshToken
        }
    }).catch((err) => { throw new Error(`네이버 토큰 갱신 실패 ${err.code}`) });

    console.log('토큰 갱신 성공', newToken.data);

    const accessToken = newToken.data.access_token;

    // 액세스토큰으로 연결 끊기 요청
    const userIdInNaver = await axios.post(`https://nid.naver.com/oauth2.0/token`, null, {
        params: {
            grant_type: 'delete',
            client_id: process.env.PASSPORT_NAVER_CLIENT_ID,
            client_secret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
            access_token: accessToken
        }
    }).catch((err) => { throw new Error(`네이버 연결 끊기 실패 ${err.code}`) });

    console.log('네이버 연결 끊기 성공', userIdInNaver.data.result);

}
