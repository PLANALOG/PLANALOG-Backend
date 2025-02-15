import { StatusCodes } from "http-status-codes";
import { 
    bodyToCreateMoment, 
    bodyToUpdateMoment,
    responseFromMyMomentDetail, 
    responseFromFriendsMoments, 
    responseFromFriendMomentDetail  } from "../dtos/moment.dto.js";
import { 
    momentCreate, 
    momentUpdate, 
    momentDelete,
    getMyMoments, 
    getMyMomentDetail, 
    getFriendsMoments, 
    getFriendMomentDetail  } from "../services/moment.service.js";


export const handleCreateMoment = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = 'Moment 생성 API'
        #swagger.description = '새로운 Moment를 생성합니다.'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            title: { type: "string", example: "25년 1월7일" },
                            plannerId: { type: "integer", nullable: true, example: 123 },
                            momentContents: {
                                type: "array",
                                items: {
                                    oneOf: [
                                        {
                                            type: "object",
                                            properties: {
                                                sortOrder: { type: "integer", example: 1 },
                                                content: { type: "string", example: "오늘 하루 열심히 공부했어요!" },
                                                url: { type: "string", nullable: true, example: "https://image1.com/image1.jpg" }
                                            }
                                        },
                                        {
                                            type: "object",
                                            properties: {
                                                sortOrder: { type: "integer", example: 2 },
                                                content: { type: "string", example: "카페에서 공부 중" },
                                                url: { type: "string", nullable: true, example: "https://image2.com/image2.jpg" }
                                            }
                                        },
                                        {
                                            type: "object",
                                            properties: {
                                                sortOrder: { type: "integer", example: 3 },
                                                content: { type: "string", example: "독서실에서 마지막 정리!" },
                                                url: { type: "string", nullable: true, example: "https://image3.com/image3.jpg" }
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        required: ["title", "momentContents"]
                    }
                }
            }
        }
    */

    try {
        const momentData = await momentCreate({
            ...bodyToCreateMoment(req.body),
            userId: req.user.id
        });

        res.status(StatusCodes.CREATED).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                data: momentData
            }
        });
    } catch (error) {
        console.error("Moment 생성 중 오류 발생:", error.message);
        next(error);
    }
};


export const handleUpdateMoment = async (req, res, next) => {
    /*
    #swagger.tags = ['Moments']
    #swagger.summary = 'Moment 수정 API'
    #swagger.description = '기존의 Moment를 수정합니다.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['momentId'] = {
        in: 'path',
        description: '수정할 Moment의 ID',
        required: true,
        schema: { type: 'integer', example: 2 }
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "수정된 제목", description: "수정된 Moment 제목" },
                        status: { type: "string", enum: ["draft", "public"], example: "public", description: "수정된 Moment 상태" },
                        momentContents: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    sortOrder: { type: "integer", example: 2, description: "수정할 페이지 순서" },
                                    content: { type: "string", example: "수정된 내용 (기존 페이지)", description: "수정된 페이지 내용" },
                                    url: { type: "string", example: "https://newimage1.com/newimage1.jpg", description: "수정된 이미지 URL" }
                                }
                            }
                        }
                    },
                    required: ["status"]
                }
            }
        }
    }
    */

    try {
        console.log("moment 수정 요청");
        const { momentId } = req.params; // 경로 파라미터에서 momentId 가져오기
        const momentData = await momentUpdate(momentId, bodyToUpdateMoment(req.body));
        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                message: "게시물이 성공적으로 수정되었습니다.",
                data: momentData
            }
        });
    } catch (error) {
        console.error("Moment 수정 중 오류 발생:", error.message);
        next(error);
    }
};



export const handleDeleteMoment = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = 'Moment 삭제 API'
        #swagger.description = '기존의 Moment를 삭제합니다.'#swagger.security = [{
        "bearerAuth": []
        }]
        
        #swagger.parameters['momentId'] = {
            in: "path",
            required: true,
            description: "삭제할 Moment의 ID",
            schema: { type: "integer", example: 123 }
        }
    */

    try {
        console.log("Moment 삭제 요청");
        const momentId = parseInt(req.params.momentId, 10);

        if (isNaN(momentId)) {
            throw new Error("유효한 Moment ID가 필요합니다.");
        }

        const deletedMomentId = await momentDelete(momentId);

        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                message: "Moment가 성공적으로 삭제되었습니다.",
                data: { deletedMomentId }
            }
        });
    } catch (error) {
        next(error);
    }
};


export const handleGetMyMoments = async (req, res, next) => {
    /*
    #swagger.tags = ['Moments']
    #swagger.summary = '나의 Moment 목록 조회 API'
    #swagger.description = '사용자의 Moment 목록을 조회합니다. 
        응답 데이터는 썸네일, 제목, 작성자, 날짜, 공감 수, 댓글 수만 포함했습니니다.'
    #swagger.security = [{ "bearerAuth": [] }]
    */

    try {
        console.log("JWT 토큰의 userId:", req.user.id); // userId 확인
        const moments = await getMyMoments(req.user.id);

        res.status(200).json({ 
            resultType: "SUCCESS", 
            error: null, 
            success: { data: moments } 
        });
    } catch (error) {
        console.error("응답 반환 중 오류 발생:", error);
        next(error);  // Express 에러 핸들러로 전달
    }
};




export const handleGetMyMomentDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = '나의 특정 Moment 상세 조회 API'
        #swagger.description = '로그인한 사용자가 자신의 특정 Moment 게시물을 상세 조회합니다.'
        #swagger.security = [{
        "bearerAuth": []
    }]

        #swagger.parameters['momentId'] = {
            in: 'path',
            required: true,
            description: '조회할 Moment의 ID',
            schema: { type: 'integer', example: 456 }
        }
    */

    try {
        console.log("나의 특정 Moment 상세 조회 요청");

        const momentId = Number(req.params.momentId);
        if (isNaN(momentId)) {  // momentId 유효성 검사 추가
            throw new Error("유효하지 않은 Moment ID입니다.");
        }

        const moment = await getMyMomentDetail(req.user.id, momentId);
        res.status(StatusCodes.OK).json({ 
            resultType: "SUCCESS", 
            error: null, 
            success: { data: responseFromMyMomentDetail(moment) } 
        });
    } catch (error) {
        console.error("Moment 상세 조회 오류:", error.message);  // ✅ 에러 로그 추가
        next(error);
    }
};



export const handleGetFriendsMoments = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = '친구의 Moment 목록 조회 API'
        #swagger.description = '친구의 페이지에서 해당 친구의 Moment 게시물 목록을 조회합니다.'
        #swagger.security = [{
        "bearerAuth": []
    }]

        #swagger.responses[200] = {
            description: '친구의 Moment 목록 조회 성공',
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS", description: "결과 상태" },
                            error: { type: "null", example: null, description: "에러 정보 (없을 경우 null)" },
                            success: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "array",
                                        description: "친구의 Moment 목록",
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "object",
                                                    properties: {
                                                        userId: { type: "integer", example: 5, description: "친구의 사용자 ID" },
                                                        momentId: { type: "integer", example: 201, description: "Moment ID" },
                                                        title: { type: "string", example: "친구의 여행기", description: "Moment 제목" },
                                                        status: { type: "string", example: "public", description: "Moment 상태" },
                                                        createdAt: { type: "string", format: "date-time", example: "2025-02-01T09:00:00Z", description: "Moment 생성일" },
                                                        updatedAt: { type: "string", format: "date-time", example: "2025-02-01T10:15:00Z", description: "Moment 수정일" },
                                                        thumbnailUrl: { type: "string", example: "https://image3.com/image3.jpg", description: "썸네일 이미지 URL" }
                                                    }
                                                },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        userId: { type: "integer", example: 5, description: "친구의 사용자 ID" },
                                                        momentId: { type: "integer", example: 202, description: "Moment ID" },
                                                        title: { type: "string", example: "카페 탐방기", description: "Moment 제목" },
                                                        status: { type: "string", example: "public", description: "Moment 상태" },
                                                        createdAt: { type: "string", format: "date-time", example: "2025-02-03T11:45:00Z", description: "Moment 생성일" },
                                                        updatedAt: { type: "string", format: "date-time", example: "2025-02-03T12:20:00Z", description: "Moment 수정일" },
                                                        thumbnailUrl: { type: "string", example: "https://image4.com/image4.jpg", description: "썸네일 이미지 URL" }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    */

    try {
        console.log("친구의 Moment 목록 조회 요청");
        const friendId = parseInt(req.params.friendId, 10);
        const moments = await getFriendsMoments(friendId);
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                data: responseFromFriendsMoments(moments)
            }
        });
    } catch (error) {
        next(error);
    }
};


export const handleGetFriendMomentDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = '친구의 특정 Moment 상세 조회 API'
        #swagger.description = '친구의 페이지에서 특정 Moment 게시물의 상세 정보를 조회합니다.'
        #swagger.security = [{
        "bearerAuth": []
    }]
        #swagger.parameters['momentId'] = {
            in: "path",
            required: true,
            description: "조회할 Moment의 ID",
            schema: { type: "integer", example: 456 }
        }

        #swagger.responses[200] = {
            description: '친구의 Moment 상세 조회 성공',
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS", description: "결과 상태" },
                            error: { type: "null", example: null, description: "에러 정보 (없을 경우 null)" },
                            success: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "object",
                                        properties: {
                                            userId: { type: "integer", example: 5, description: "친구의 사용자 ID" },
                                            momentId: { type: "integer", example: 456, description: "Moment ID" },
                                            plannerId: { type: "integer", example: 123, description: "Planner ID" },
                                            title: { type: "string", example: "25년 1월 7일", description: "Moment 제목" },
                                            status: { type: "string", example: "draft", description: "Moment 상태" },
                                            createdAt: { type: "string", format: "date-time", example: "2025-01-21T12:34:56Z", description: "Moment 생성일" },
                                            updatedAt: { type: "string", format: "date-time", example: "2025-01-21T13:00:00Z", description: "Moment 수정일" },
                                            momentContents: {
                                                type: "array",
                                                description: "Moment 콘텐츠 목록",
                                                items: {
                                                    oneOf: [
                                                        {
                                                            type: "object",
                                                            properties: {
                                                                sortOrder: { type: "integer", example: 1, description: "콘텐츠 순서" },
                                                                content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "콘텐츠 내용" },
                                                                url: { type: "string", example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            properties: {
                                                                sortOrder: { type: "integer", example: 2, description: "콘텐츠 순서" },
                                                                content: { type: "string", example: "카페에서 공부 중", description: "콘텐츠 내용" },
                                                                url: { type: "string", example: "https://image2.com/image2.jpg", description: "이미지 URL" }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            properties: {
                                                                sortOrder: { type: "integer", example: 3, description: "콘텐츠 순서" },
                                                                content: { type: "string", example: "독서실에서 마지막 정리!", description: "콘텐츠 내용" },
                                                                url: { type: "string", example: "https://image3.com/image3.jpg", description: "이미지 URL" }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    */

    try {
        console.log("친구의 특정 Moment 상세 조회 요청");
        const friendId = parseInt(req.params.friendId, 10);
        const momentId = parseInt(req.params.momentId, 10);
        const moment = await getFriendMomentDetail(friendId, momentId);
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                data: responseFromFriendMomentDetail(moment)
            }
        });
    } catch (error) {
        next(error);
    }
};