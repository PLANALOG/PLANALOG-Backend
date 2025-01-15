import { StatusCodes } from "http-status-codes";
import { bodyToUpdateUser } from "../dtos/user.dto.js";
import { checkNickname, } from "../services/user.service.js";
import { userEdit } from "../services/user.service.js";

export const handleEditUser = async (req, res, next) => {
    /*
    #swagger.summary = '회원정보 수정 API'
    #swagger.security = [{
            "OAuth2": [
                'read', 
                'write'
            ]
    }]
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        nickname: { type: "string", example: "newNickname" },
                        type: { 
                            type: "string", 
                            enum: ["memo_user", "category_user"], 
                            example: "memo_user" 
                        },
                        introduction: { type: "string", example: "Hello, I am new here!" },
                        link: { type: "string", format: "uri", example: "https://myportfolio.com" }
                    }
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "회원정보 수정 성공 응답",
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
                                userId: { type: "string", example: "123" },
                                email: { type: "string", example: "email1@naver.com" },
                                platform: { type: "string", example: "naver" },
                                name: { type: "string", example: "홍길동" },
                                nickname: { type: "string", example: "newNickname" },
                                type: { 
                                    type: "string", 
                                    enum: ["memo_user", "category_user"], 
                                    example: "memo_user" 
                                },
                                introduction: { type: "string", example: "Hello, I am new here!" },
                                link: { type: "string", format: "uri", example: "https://myportfolio.com" },
                            }
                        }
                    }
                }
            }
        }
    }
*/

    console.log('회원정보 수정을 요청했습니다.')

    if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 누락되었습니다.");
    }

    const userId = req.user.id

    console.log(req.user)

    const user = await userEdit(bodyToUpdateUser(req.body), userId)

    res.status(StatusCodes.OK).success(user);
}

export const handleCheckNickname = async (req, res, next) => {
    /*
        #swagger.summary = '닉네임 중복 확인 API'
        #swagger.parameters['nickname'] = {
            in: 'query',
            description: '중복 확인할 닉네임',
            required: true,
            schema: {
                type: 'string',
                example: 'newNickname'
            }
        }
        #swagger.responses[200] = {
            description: "닉네임 중복 확인 성공 응답",
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
                                    isDuplicated: { type: "boolean", example: true }
                                }
                            }
                        }
                    }
                }
            }
        }
    */

    console.log('닉네임 중복 조회를 요청했습니다.');

    console.log(req)

    const nickname = req.query.nickname;

    const isDuplicated = await checkNickname(nickname);

    res.status(StatusCodes.OK).success({ isDuplicated });

}