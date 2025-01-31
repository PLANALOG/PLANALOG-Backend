// const express = require('express')  // -> CommonJS
import dotenv from "dotenv";
import express from 'express';          // -> ES Module
import cors from "cors";
import task from "./routes/task.js";
import taskCategory from "./routes/category.js"; //라우터 객체 가져오기 
import { prisma } from "./db.config.js";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { handleEditUser, handleCheckNickname, handleMyProfile, handleUserProfile, handleDeleteUser, handleTestDeleteUser, handleEditUserImage, handleLogOut } from "./controllers/user.controller.js";
import { body, query, param } from "express-validator";
import { handleDisplayPlanner, handleDeletePlanner } from "./controllers/planner.controller.js";
import { userDeleteScheduler } from "./scheduler.js";
import { upload } from "./multer.js";
import { authenticateJWT } from "./auth.config.js";
import { handleNaverTokenLogin, handleKakaoTokenLogin, handleGoogleTokenLogin, handleRefreshToken } from "./auth.config.js";
import { testUserMiddleware } from "./test.js";

dotenv.config();


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
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "토큰을 입력하세요."
        }
      }
    },
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

BigInt.prototype.toJSON = function () { // bigint 호환
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

app.get('/', (req, res) => {
  // #swagger.ignore = true
  res.send('Hello World!')
  console.log(req.user)
})

//로그아웃
app.get("/logout", authenticateJWT, handleLogOut);

app.post("/oauth2/naver/token", handleNaverTokenLogin);

app.post("/oauth2/kakao/token", handleKakaoTokenLogin);

app.post("/oauth2/google/token", handleGoogleTokenLogin);

//리프레시 토큰 이용해 액세스 토큰 재발급 
app.post("/refresh_token", handleRefreshToken);

//테스트용 (로컬 DB에 유저 추가 및 토큰 발급)
app.post("/test/create_user", testUserMiddleware);

// Mock 인증 미들웨어
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 1 }; // Mock user ID
  next();
};
//task 관련 작업 
app.use("/tasks", mockAuthMiddleware, task);
//task_category 관련작업
app.use("/task_category", mockAuthMiddleware, taskCategory)

//회원정보 수정 API
app.patch("/users/profile", [
  body("nickname").optional().isString().isLength({ max: 20 }).withMessage("nickname은 20자 이내의 문자열이어야 합니다."),
  body("type").optional().isIn(["memo_user", "category_user"]).withMessage("type은 memo_user 또는 category_user만 가능합니다."),
  body("introduction").optional().isString().withMessage("introduction은 문자열이어야 합니다."),
  body("link").optional().isURL().withMessage("link는 URL 형식이어야 합니다."),
], authenticateJWT, handleEditUser);

// 프로필 사진 변경 
app.post("/users/profile/image", authenticateJWT, upload.single("image"), handleEditUserImage);

//닉네임 중복 조회 API
app.get("/users/check_nickname",
  query("nickname").exists().withMessage("닉네임을 입력하세요.")
    .isString().isLength({ max: 20 }).withMessage("nickname은 20자 이내의 문자열이어야 합니다."),
  handleCheckNickname);

//자신의 회원 정보 조회
app.get("/users", authenticateJWT, handleMyProfile)

//회원 정보 조회
app.get("/users/:userId", [
  param("userId").exists().withMessage("userId를 입력하세요.").isInt().withMessage("userId는 숫자여야 합니다."),
], handleUserProfile)


//플래너 조회 
app.get('/planners', [
  query("userId").optional().isInt().withMessage("userId는 숫자여야 합니다."),
  query("date").optional().isDate().withMessage("date는 날짜형식이어야 합니다.ex)2025-01-01"),
], authenticateJWT, handleDisplayPlanner);

//플래너 삭제 
app.delete("/planners/:plannerId", [
  param("plannerId").exists().withMessage("plannerId를 입력하세요.").isInt().withMessage("plannerId는 숫자여야 합니다."),
], authenticateJWT, handleDeletePlanner);

//회원 탈퇴 
app.delete("/users", authenticateJWT, handleDeleteUser)

//테스트용 : 회원탈퇴복구 (탈퇴 회원 바로 회원가입 가능)
app.post("/users/test", handleTestDeleteUser)

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

//매일 자정 탈퇴한 지 14일이 지난 유저 삭제
app.listen(port, userDeleteScheduler);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


import { saveSearchRecord/*, getSearchRecords, deleteSearchRecord, deleteAllSearchRecords*/ } from "./controllers/search.controller.js";

import { searchUsers } from "./controllers/search.controller.js";
import { getSearchRecords } from "./controllers/search.controller.js";
import { deleteSearchRecord } from "./controllers/search.controller.js";



import { updateNoticeReadStatus } from "./controllers/notice.controller.js";
import { createNotice } from "./controllers/notice.controller.js";
import { deleteNotice } from "./controllers/notice.controller.js";
import { getNotices } from "./controllers/notice.controller.js";


app.get("/searches/users", searchUsers);
app.post("/searches", saveSearchRecord);
app.get("/searches/records", getSearchRecords);
app.post("/post/notices", createNotice);
app.patch("/notices/:noticeId/read", updateNoticeReadStatus);
app.get("/notices", getNotices);
app.delete("/notices/:noticeId", deleteNotice);
app.delete("/searches/records/:recordId", deleteSearchRecord);
