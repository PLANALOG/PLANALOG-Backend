import { StatusCodes } from "http-status-codes";
import { bodyToUpdateUser } from "../dtos/user.dto.js";
import { userEdit, nicknameCheck, myProfile, userProfile, userDelete, profileImageEdit } from "../services/user.service.js";
import { prisma } from "../db.config.js"
import { validationError } from "../validator.js";
import { validationResult } from "express-validator";
import { authError } from "../errors.js";



export const handleEditUser = async (req, res, next) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = '회원정보 수정 API'
    #swagger.security = [{
        "bearerAuth": []
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

    validationError(req);

    //유효성 검사 에러 반환
    if (!validationResult(req).isEmpty()) {
        const errorsMessages = validationResult(req).array().map((error) => error.msg);
        //자바스크립트에서 배열을 문자열로 변환하려고 하면 암묵적으로 Array.prototype.toString 메서드가 호출
        throw new Error(`입력정보가 유효하지않습니다. ${errorsMessages}`)
    }

    if (!req.user || !req.user.id) {
        throw new authError();
    }

    const userId = req.user.id

    console.log(req.body)

    console.log(req.user)

    const user = await userEdit(bodyToUpdateUser(req.body), userId)

    res.status(StatusCodes.OK).success(user);
}

export const handleCheckNickname = async (req, res, next) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = '닉네임 중복 확인 API'
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

    //유효성 검사 에러 반환
    validationError(req);

    console.log('닉네임 중복 조회를 요청했습니다.');

    const nickname = req.query.nickname;

    const isDuplicated = await nicknameCheck(nickname);

    res.status(StatusCodes.OK).success({ isDuplicated });

}

export const handleMyProfile = async (req, res, next) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = '본인 회원 정보 조회 API'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: "회원 정보 조회 성공 응답",
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
                                userId: { type: "integer", example: 6 },
                                email: { type: "string", example: "dayeong0120@gmail.com" },
                                platform: { type: "string", example: "google" },
                                name: { type: "string", example: "김다영" },
                                nickname: { type: "string", example: "다영이이" },
                                type: { 
                                    type: "string", 
                                    example: "memo_user" 
                                },
                                introduction : { type : "string", example : "추후 수정,"},
                                link: { type: "string", example: "추후 수정" }
                            }
                        }
                    }
                }
            }
        }
    }
    */
    console.log('사용자 본인의 회원 정보 조회를 요청했습니다.');

    //유효성 검사 에러 반환
    validationError(req);

    if (!req.user || !req.user.id) {
        throw new authError();
    }

    const userId = req.user.id

    const user = await myProfile(userId);

    res.status(StatusCodes.OK).success(user);
}


export const handleUserProfile = async (req, res, next) => {
    /*
    #swagger.tags = ['Users']
    #swagger.summary = '회원 정보 조회 API'

    #swagger.responses[200] = {
        description: "회원 정보 조회 성공 응답",
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
                                userId: { type: "integer", example: 6 },
                                nickname: { type: "string", example: "추후 수정" },
                                type: { 
                                    type: "string", 
                                    example: "memo_user" 
                                },
                                introduction: { type: "string", example: "추후 수정" },
                                link: { type: "string", example: "추후 수정" }
                            }
                        }
                    }
                }
            }
        }
    }
    */
    console.log('회원 정보 조회를 요청했습니다.');

    //유효성 검사 에러 반환
    validationError(req);

    const userId = parseInt(req.params.userId);

    const user = await userProfile(userId);

    res.status(StatusCodes.OK).success(user);
}

export const handleDeleteUser = async (req, res, next) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = '회원탈퇴 API'
    #swagger.security = [{
        "bearerAuth": []
    }]
    */
    console.log("회원탈퇴를 요청했습니다.")


    if (!req.user || !req.user.id) {
        throw new authError();
    }

    const userId = parseInt(req.user.id);

    console.log(req.user)


    const deletedUser = await userDelete(userId, req.user);

    req.session.destroy()

    res.status(StatusCodes.OK).success({ deletedUser });
}

export const handleTestDeleteUser = async (req, res, next) => {
    /* 
    #swagger.tags = ['Users']
    #swagger.summary = '[테스트용] 회원탈퇴복구 API'
    #swagger.description = '탈퇴 후 14일 후 재가입 가능한 계정의 이메일과 가입 플랫폼 (google, naver, kakao)를 body에 담아 요청하면 바로 재가입할 수 있습니다.'
    */
    console.log("회원탈퇴복구를 요청했습니다.")

    const email = req.body.email;
    const platform = req.body.platform;

    const user = await prisma.user.delete({
        where: { email, platform }
    })

    res.status(StatusCodes.OK).success({ message: "회원탈퇴 복구가 완료되었습니다. 바로 재가입할 수 있습니다.", user });

}

export const handleEditUserImage = async (req, res, next) => {
    /*
        #swagger.tags = ['Users']
        #swagger.summary = '프로필 사진 변경 API'
        #swagger.description = `
            파일 업로드 시 이미지 파일을 받아 프로필 사진을 변경합니다. 
            기본 이미지를 사용할 경우, 'basicImage' 필드에 1~8 사이의 숫자를 입력합니다.`
        #swagger.security = [{
        "bearerAuth": []
    }]
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: 'object',
                        properties: {
                            image: {
                                type: 'string',
                                format: 'binary',
                                description: '업로드할 이미지 파일'
                            },
                            basicImage: {
                                type: 'integer',
                                description: '기본 이미지 번호 (1~8)',
                                minimum: 1,
                                maximum: 8
                            }
                        },
                        oneOf: [
                            { required: ['image'] },
                            { required: ['basicImage'] }
                        ]
                    }
                }
            }
        }
    */
    console.log("회원 프로필사진 변경을 요청했습니다.");
    console.log(req.file);

    let imagePaths;
    let isBasicImage = false;

    if (req.file) {
        //저장된 이미지 url을 받아옴
        imagePaths = req.file.location;
    } else {
        const BasicImageNum = req.body.basicImage;
        imagePaths = `https://planalog-s3.s3.ap-northeast-2.amazonaws.com/basic_images/${BasicImageNum}.png`;
        isBasicImage = true;
    }


    if (!req.user || !req.user.id) {
        throw new authError();
    }
    const userId = parseInt(req.user.id);


    const savedUrl = await profileImageEdit(imagePaths, userId, isBasicImage);


    res.status(StatusCodes.OK).success({ message: "프로필 사진 변경 성공", savedUrl: savedUrl.profileImage });
}