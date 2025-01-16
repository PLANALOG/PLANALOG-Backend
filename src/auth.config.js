import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as NaverStrategy } from "passport-naver";
import { prisma } from "./db.config.js";
import { UserWithOtherPlatformError } from "./errors.js";

dotenv.config();

const verify = async (profile, email, platform) => {

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        // 해당 이메일을 가진 유저가 있을 떄 
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 같으면 => 로그인 (return)
        if (user.platform === platform) return { id: user.id, email: user.email, name: user.name };
        // 그 유저의 플랫폼이 파라미터의 플랫폼과 다르면 => 에러반환 (with 플랫폼) 
        else throw new UserWithOtherPlatformError({ name: user.name, platform: user.platform })
    }

    const created = await prisma.user.create({
        data: {
            email,
            platform,
            name: profile.displayName,
            nickname: "추후 수정",
            type: "memo_user",
            introduction: "추후 수정",
            link: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};

//구글 로그인 
export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new Error(`profile.email was not found: ${profile}`);
        }

        return verify(profile, email, "google")
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

// 카카오 로그인 
export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/kakao",
    },
    (accessToken, refreshToken, profile, cb) => {
        const email = profile._json.kakao_account?.email;
        if (!email) {
            throw new Error(`profile._jaon.kakao_account?.email was not found: ${profile}`);
        }

        return verify(profile, email, "kakao")
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

// 네이버 로그인 
export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/naver",
    },
    (accessToken, refreshToken, profile, cb) => {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new Error(`profile.email was not found: ${profile}`);
        }

        return verify(profile, email, "naver")
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);
