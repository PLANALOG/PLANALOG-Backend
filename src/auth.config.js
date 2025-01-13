import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }

    const created = await prisma.user.create({
        data: {
            email,
            platform: "google",
            name: profile.displayName,
            nickname: "추후 수정",
            type: null,
            introduction: "추후 수정",
            link: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};


export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/kakao",
    },
    (accessToken, refreshToken, profile, cb) => {
        return kakaoVerify(profile)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

const kakaoVerify = async (profile) => {
    console.log("email : ", profile._json.kakao_account?.email)
    console.log("profile : ", profile); //삭제 예쩡 

    const email = profile._json.kakao_account?.email;
    if (!email) {
        throw new Error(`profile._jaon.kakao_account?.email was not found: ${profile}`);
    }

    const user = await prisma.user.findFirst({ where: { email } });
    if (user !== null) {
        return { id: user.id, email: user.email, name: user.name };
    }

    const created = await prisma.user.create({
        data: {
            email,
            platform: "kakao",
            name: profile.displayName,
            nickname: "추후 수정",
            type: null,
            introduction: "추후 수정",
            link: "추후 수정",
        },
    });

    return { id: created.id, email: created.email, name: created.name };
};