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
import { testUserMiddleware, testUser2Middleware } from "./test.js";

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
    host: process.env.SWAGGER_HOST,
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

app.get('/health', (req, res) => {
  console.log("health check");
  res.status(200).send("OK");
});

//로그아웃
app.get("/logout", authenticateJWT, handleLogOut);

//네이버 로그인/회원가입
app.post("/oauth2/naver/token", [
  body("accessToken").exists().withMessage("accessToken을 입력하세요."),
  body("refreshToken").exists().withMessage("refreshToken을 입력하세요.")
], handleNaverTokenLogin);

//카카오 로그인/회원가입
app.post("/oauth2/kakao/token", [
  body("accessToken").exists().withMessage("accessToken을 입력하세요."),
  body("refreshToken").exists().withMessage("refreshToken을 입력하세요.")
], handleKakaoTokenLogin);

//구글 로그인/회원가입
app.post("/oauth2/google/token", [
  body("accessToken").exists().withMessage("accessToken을 입력하세요."),
  body("refreshToken").exists().withMessage("refreshToken을 입력하세요.")
], handleGoogleTokenLogin);

//리프레시 토큰 이용해 액세스 토큰 재발급 
app.post("/refresh_token", [
  body("refreshToken").exists().withMessage("refreshToken을 입력하세요.")
], handleRefreshToken);

//테스트용 (로컬 DB에 유저 추가 및 토큰 발급)
app.post("/test/create_user", testUserMiddleware);
app.post("/test/create_user2", testUser2Middleware);



//task 관련 작업 
app.use("/tasks", authenticateJWT, task);
//task_category 관련작업
app.use("/task_category", authenticateJWT, taskCategory)

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


import {
  handleCreateMoment,
  handleUpdateMoment,
  handleDeleteMoment,
  handleGetMyMoments,
  handleGetMyMomentDetail,
  handleGetOtherUserMoments,
  handleGetOtherUserMomentDetail
} from "./controllers/moment.controller.js";

app.post("/moments", authenticateJWT, handleCreateMoment); //모먼트 생성
app.patch("/moments/:momentId", authenticateJWT, handleUpdateMoment); //모먼트 수정
app.delete("/moments/:momentId", authenticateJWT, handleDeleteMoment); //모먼트 삭제
app.get("/mypage/moments", authenticateJWT, handleGetMyMoments); //마이페이지에서 나의 moment게시글 목록 조회
app.get("/mypage/moments/:momentId", authenticateJWT, handleGetMyMomentDetail); //마이페이지에서 나의  특정 moment게시물 조회 
app.get("/users/:userId/moments", authenticateJWT, handleGetOtherUserMoments) //친구페이지 moment게시물 목록 조회
app.get("/users/:userId/moments/momentId", authenticateJWT, handleGetOtherUserMomentDetail); //친구페이지 특정 moment게시물 조회



//회원 탈퇴 
app.delete("/users", authenticateJWT, handleDeleteUser)

//테스트용 : 회원탈퇴복구 (탈퇴 회원 바로 회원가입 가능)
app.post("/users/test", handleTestDeleteUser)

import { saveSearchRecord/*, getSearchRecords, deleteSearchRecord, deleteAllSearchRecords*/ } from "./controllers/search.controller.js";
import { searchUsers } from "./controllers/search.controller.js";
import { getSearchRecords } from "./controllers/search.controller.js";
import { deleteSearchRecord } from "./controllers/search.controller.js";
import { updateNoticeReadStatus } from "./controllers/notice.controller.js";
import { createNotice } from "./controllers/notice.controller.js";
import { deleteNotice } from "./controllers/notice.controller.js";
import { getNotices } from "./controllers/notice.controller.js";
import { addFriend, acceptFriend, getFollowing, getFollowers, deleteFriend, getFriendCount, getFriendCountByUserId } from "./controllers/friend.controller.js";
import { handleLikeMoment, handleDeleteLikeMoment } from './controllers/like.controller.js';
import { handleAddComment, handleEditComment, handleDeleteComment, handleListComment } from './controllers/comment.controller.js';



app.get("/searches/users", authenticateJWT, searchUsers);
app.post("/searches", authenticateJWT, saveSearchRecord);
app.get("/searches/records", authenticateJWT, getSearchRecords);
app.post("/notices", authenticateJWT, createNotice);
app.patch("/notices/:noticeId/read", authenticateJWT, updateNoticeReadStatus);
app.get("/notices", authenticateJWT, getNotices);
app.post('/friends', authenticateJWT, addFriend);            // 친구 추가 기능
app.get('/friends/following', authenticateJWT, getFollowing); // 내가 팔로우하는 사람 목록
app.get('/friends/followers', authenticateJWT, getFollowers); // 나를 팔로우하는 사람 목록
app.get('/friends/count', authenticateJWT, getFriendCount);  // count 엔드포인트를 위로 이동
app.get('/friends/count/:userId', authenticateJWT, getFriendCountByUserId);
app.patch("/friends/:friendId", authenticateJWT, acceptFriend); // 친구 요청 수락
app.delete("/notices/:noticeId", authenticateJWT, deleteNotice);
app.delete("/searches/records/:recordId", authenticateJWT, deleteSearchRecord);
app.delete('/friends/:friendId', authenticateJWT, deleteFriend); //친구 삭제 기능
app.post("/moments/:momentId/likes", authenticateJWT, handleLikeMoment);//좋아요 추가
app.delete("/moments/:momentId/likes", authenticateJWT, handleDeleteLikeMoment);//좋아요 삭제
app.post("/moments/:momentId/comments", authenticateJWT, handleAddComment);//댓글 추가
app.patch("/moments/:momentId/comments/:commentId", authenticateJWT, handleEditComment);//댓글 수정
app.delete("/comments/:commentId", authenticateJWT, handleDeleteComment);//댓글 삭제
app.get("/moments/:momentId/comments", handleListComment);//댓글 목록

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


