// const express = require('express')  // -> CommonJS
import dotenv from "dotenv";
import express from 'express';          // -> ES Module
import cors from "cors";
import task from "./routes/task.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy, kakaoStrategy, naverStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";

dotenv.config();

passport.use(googleStrategy);
passport.use(kakaoStrategy);
passport.use(naverStrategy);
passport.serializeUser((user, done) => {
  //console.log('serializeUser success')
  done(null, user)
});
passport.deserializeUser((user, done) => {
  //console.log('deserializeUser success')
  done(null, user)
});

const app = express()
const port = process.env.PORT;


/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록 -> 모든 요청에서 실행되는 미들웨어 함수 
 */
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.use(
  session({
    cookie: { //세션 ID 쿠키의 옵션을 지정하는 객체
      maxAge: 7 * 24 * 60 * 1000, //ms
    },
    resave: false, //수정되지 않은 세션일지라도 다시 저장할지(세션을 언제나 저장할지) 나타내는 부울 값.
    saveUninitalized: false, //초기화되지 않은 세션을 저장할지(세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지) 
    secret: process.env.EXPRESS_SESSION_SECRET, //세션 ID 쿠키를 서명하는 데 사용할 문자열. 보안 목적으로 필수적.
    store: new PrismaSessionStore(prisma, { // 세션 데이터의 저장 메커니즘
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined
    })
  })
);

app.use(passport.initialize());
app.use(passport.session()); //사용자의 모든 요청에 HTTP Cookie 중 sid 값이 있다면, 이를 MySQL DB에서 찾아, 일치하는 Session이 있다면 사용자 데이터를 가져와 req.user

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "PLANALOG",
      description: "PLANALOG 테스트 문서입니다.",
    },
    host: "localhost:3000",
    components: {
      securitySchemes: {
        OAuth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'http://localhost:3000/oauth2/login/google',
              tokenUrl: 'http://localhost:3000/oauth2/callback/google',
              scopes: {
                read: 'Grants read access',
                write: 'Grants write access',
                admin: 'Grants access to admin operations'
              }
            }
          }
        }
      }
    }
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

BigInt.prototype.toJSON = function () { // bigint 호환
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

app.get('/', (req, res) => {
  res.send('Hello World!')
  console.log(req.user)
})

//소셜로그인 - 구글 
app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/oauth2/login/google",
    failureMessage: true,
  }),
  (req, res) => res.success()
);

//소셜로그인 - 카카오
app.get("/oauth2/login/kakao", passport.authenticate("kakao"));
app.get(
  "/oauth2/callback/kakao",
  passport.authenticate("kakao", {
    failureRedirect: "/oauth2/login/kakao",
    failureMessage: true,
  }),
  (req, res) => res.success()
);

//소셜로그인 - 네이버
app.get("/oauth2/login/naver", passport.authenticate("naver"));
app.get(
  "/oauth2/callback/naver",
  passport.authenticate("naver", {
    failureRedirect: "/oauth2/login/naver",
    failureMessage: true,
  }),
  (req, res) => res.success()
);

//로그아웃
app.get("/logout", (req, res) => {
  req.logout(() => success());
});

app.use("/tasks", task);


/**
 * 전역 오류를 처리하기 위한 미들웨어 : 반드시 라우팅 마지막에 정의
 */
app.use((err, req, res, next) => { //
  if (res.headersSent) { //응답 헤더가 이미 전송되었으면 
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})