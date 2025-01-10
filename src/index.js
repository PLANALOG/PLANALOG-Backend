// const express = require('express')  // -> CommonJS
import dotenv from "dotenv";
import express from 'express';          // -> ES Module
import cors from "cors";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient(); 
// export const prisma = new PrismaClient({ log: ["query"] }); - sql 쿼리 확인 가능 옵션 (필요시 사용) 

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

BigInt.prototype.toJSON = function () { // bigint 호환
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})