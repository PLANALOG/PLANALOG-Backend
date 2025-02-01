import { StatusCodes } from "http-status-codes";
import { 
    bodyToCreateMoment, 
    bodyToUpdateMoment,
    responseFromMyMoments, 
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
                        title: { type: "string", example: "25년 1월7일", description: "Moment 제목" },
                        status: { type: "string", enum: ["draft", "public"], example: "draft", description: "Moment 상태" },
                        plannerId: { type: "integer", example: 123, description: "해당 Moment가 연결된 Planner의 ID" },
                        momentContents: {
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            sortOrder: { type: "integer", example: 1, description: "Moment 페이지 순서" },
                                            content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "Moment 페이지 내용" },
                                            url: { type: "string", nullable: true, example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sortOrder: { type: "integer", example: 2, description: "Moment 페이지 순서" },
                                            content: { type: "string", example: "카페에서 공부 중 ☕", description: "Moment 페이지 내용" },
                                            url: { type: "string", example: "https://image2.com/image2.jpg", description: "이미지 URL" }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sortOrder: { type: "integer", example: 3, description: "Moment 페이지 순서" },
                                            content: { type: "string", example: "독서실에서 마지막 정리!", description: "Moment 페이지 내용" },
                                            url: { type: "string", nullable: true, example: "https://image3.com/image3.jpg", description: "이미지 URL" }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    required: ["title", "status", "momentContents"]
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "Moment 생성 성공",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS", description: "결과 상태" },
                        error: { type: "object", nullable: true, example: null, description: "에러 정보" },
                        success: { 
                            type: "object",
                            properties: {
                                data: {
                                    type: "object",
                                    properties: {
                                        userId: { type: "integer", example: 5, description: "생성한 사용자 ID" },
                                        momentId: { type: "integer", example: 456, description: "생성된 Moment의 ID" },
                                        plannerId: { type: "integer", example: 123, description: "Planner ID" },
                                        title: { type: "string", example: "25년 1월 7일", description: "Moment 제목" },
                                        status: { type: "string", example: "draft", description: "Moment 상태" },
                                        createdAt: { type: "string", format: "date-time", example: "2025-01-21T12:34:56Z", description: "Moment 생성 시간" },
                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-21T13:00:00Z", description: "Moment 수정 시간" },
                                        momentContents: {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            sortOrder: { type: "integer", example: 1, description: "Moment 페이지 순서" },
                                                            content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "Moment 페이지 내용" },
                                                            url: { type: "string", nullable: true, example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                                        }
                                                    },
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            sortOrder: { type: "integer", example: 2, description: "Moment 페이지 순서" },
                                                            content: { type: "string", example: "카페에서 공부 중 ", description: "Moment 페이지 내용" },
                                                            url: { type: "string", example: "https://image2.com/image2.jpg", description: "이미지 URL" }
                                                        }
                                                    },
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            sortOrder: { type: "integer", example: 3, description: "Moment 페이지 순서" },
                                                            content: { type: "string", example: "독서실에서 마지막 정리!", description: "Moment 페이지 내용" },
                                                            url: { type: "string", nullable: true, example: "https://image3.com/image3.jpg", description: "이미지 URL" }
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
        console.log("moment 생성요청");
        const momentData = await momentCreate(bodyToCreateMoment(req.body, req.user.id));
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                data: momentData
            }
        });
    } catch (error) {
        next(error);
    }
};



export const handleUpdateMoment = async (req, res, next) => {
    /*
    #swagger.tags = ['Moments']
    #swagger.summary = 'Moment 수정 API'
    #swagger.description = '기존의 Moment를 수정합니다.'
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
                        title: { type: "string", example: "수정된 제목", description: "수정된 Moment 제목" },
                        status: { type: "string", enum: ["draft", "public"], example: "public", description: "수정된 Moment 상태" },
                        momentContents: {
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            sortOrder: { type: "integer", example: 2, description: "수정할 페이지 순서" },
                                            content: { type: "string", example: "수정된 내용 (기존 페이지)", description: "수정된 페이지 내용" },
                                            url: { type: "string", example: "https://newimage1.com/newimage1.jpg", description: "수정된 이미지 URL" }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            sortOrder: { type: "integer", nullable: true, example: null, description: "새로운 페이지의 경우 null" },
                                            content: { type: "string", example: "새로 추가된 페이지 (2번째와 3번째 사이 삽입)", description: "새로 추가된 페이지 내용" },
                                            url: { type: "string", example: "https://newimage2.com/image2.jpg", description: "새로 추가된 이미지 URL" },
                                            insertAfterId: { type: "integer", example: 2, description: "새로운 페이지를 삽입할 위치의 ID" }
                                        }
                                    }
                                ]
                            }
                        },
                        deletedSortOrders: {
                            type: "array",
                            description: "삭제할 페이지의 sortOrder 목록",
                            items: {
                                type: "integer",
                                example: 4
                            }
                        }
                    },
                    required: ["status"]
                }
            }
        }
    }

    #swagger.responses[200] = {
        description: 'Moment 수정 성공',
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS", description: "결과 타입" },
                        error: { type: "null", example: null, description: "에러 정보 (없을 경우 null)" },
                        success: {
                            type: "object",
                            properties: {
                                message: { type: "string", example: "게시물이 성공적으로 수정되었습니다.", description: "성공 메시지" },
                                data: {
                                    type: "object",
                                    properties: {
                                        userId: { type: "integer", example: 5, description: "사용자 ID" },
                                        momentId: { type: "integer", example: 456, description: "수정된 Moment ID" },
                                        title: { type: "string", example: "수정된 제목", description: "수정된 Moment 제목" },
                                        status: { type: "string", enum: ["draft", "public"], example: "public", description: "수정된 Moment 상태" },
                                        plannerId: { type: "integer", nullable: true, example: 123, description: "연결된 Planner ID" },
                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-11T12:34:56Z", description: "수정된 시간" },
                                        momentContents: {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            sortOrder: { type: "integer", example: 2, description: "Moment 페이지 순서" },
                                                            content: { type: "string", example: "수정된 내용 (기존 페이지)", description: "Moment 콘텐츠 내용" }
                                                        }
                                                    },
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            sortOrder: { type: "integer", example: 5, description: "새로 추가된 페이지 순서" },
                                                            content: { type: "string", example: "새로 추가된 페이지 (2번째와 3번째 사이 삽입)", description: "새로 추가된 콘텐츠 내용" }
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
        console.log("moment 수정 요청");
        const momentData = await momentUpdate(bodyToUpdateMoment(req.body, req.user.id));
        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                message: "게시물이 성공적으로 수정되었습니다.",
                data: momentData
            }
        });
    } catch (error) {
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

        #swagger.responses[200] = {
            description: 'Moment 삭제 성공',
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS", description: "결과 타입" },
                            error: { type: "object", nullable: true, example: null, description: "에러 정보 (없을 경우 null)" },
                            success: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Moment가 성공적으로 삭제되었습니다.", description: "성공 메시지" },
                                    data: {
                                        type: "object",
                                        properties: {
                                            deletedMomentId: { type: "integer", example: 123, description: "삭제된 Moment ID" }
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
        #swagger.description = '사용자의 Moment 목록을 조회합니다.'
        #swagger.security = [{
        "bearerAuth": []
    }]

        #swagger.responses[200] = {
            description: '나의 Moment 목록 조회 성공',
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
                                        description: "나의 Moment 목록",
                                        items: {
                                            oneOf: [
                                                {
                                                    type: "object",
                                                    properties: {
                                                        momentId: { type: "integer", example: 101, description: "Moment ID" },
                                                        title: { type: "string", example: "25년 1월 7일", description: "Moment 제목" },
                                                        status: { type: "string", example: "public", description: "Moment 상태 (공개 여부)" },
                                                        createdAt: { type: "string", format: "date-time", example: "2025-01-21T12:34:56Z", description: "Moment 생성일" },
                                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-21T13:00:00Z", description: "Moment 수정일" },
                                                        thumbnailUrl: { type: "string", example: "https://image1.com/image1.jpg", description: "Moment 썸네일 URL" }
                                                    }
                                                },
                                                {
                                                    type: "object",
                                                    properties: {
                                                        momentId: { type: "integer", example: 102, description: "Moment ID" },
                                                        title: { type: "string", example: "25년 1월 8일", description: "Moment 제목" },
                                                        status: { type: "string", example: "public", description: "Moment 상태 (공개 여부)" },
                                                        createdAt: { type: "string", format: "date-time", example: "2025-01-22T14:00:00Z", description: "Moment 생성일" },
                                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-22T15:30:00Z", description: "Moment 수정일" },
                                                        thumbnailUrl: { type: "string", example: "https://image2.com/image2.jpg", description: "Moment 썸네일 URL" }
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
        console.log("나의 Moment 목록 조회 요청");
        const moments = await getMyMoments(req.user.id);
        res.status(StatusCodes.OK).json({ 
            resultType: "SUCCESS", 
            error: null, 
            success: { data: responseFromMyMoments(moments) } 
        });
    } catch (error) {
        next(error);
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

        #swagger.responses[200] = {
            description: '나의 특정 Moment 상세 조회 성공',
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
                                        description: "나의 특정 Moment 상세 정보",
                                        properties: {
                                            userId: { type: "integer", example: 5, description: "사용자 ID" },
                                            momentId: { type: "integer", example: 456, description: "Moment ID" },
                                            plannerId: { type: "integer", example: 123, description: "Planner ID" },
                                            title: { type: "string", example: "25년 1월 7일", description: "Moment 제목" },
                                            status: { type: "string", example: "draft", description: "Moment 상태 (draft, public 등)" },
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
                                                                sortOrder: { type: "integer", example: 1, description: "페이지 순서" },
                                                                content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "콘텐츠 내용" },
                                                                url: { type: "string", example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            properties: {
                                                                sortOrder: { type: "integer", example: 2, description: "페이지 순서" },
                                                                content: { type: "string", example: "카페에서 공부 중", description: "콘텐츠 내용" },
                                                                url: { type: "string", example: "https://image2.com/image2.jpg", description: "이미지 URL" }
                                                            }
                                                        },
                                                        {
                                                            type: "object",
                                                            properties: {
                                                                sortOrder: { type: "integer", example: 3, description: "페이지 순서" },
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
        console.log("나의 특정 Moment 상세 조회 요청");
        const momentId = parseInt(req.params.momentId, 10);
        const moment = await getMyMomentDetail(req.user.id, momentId);
        res.status(StatusCodes.OK).json({ 
            resultType: "SUCCESS", 
            error: null, 
            success: { data: responseFromMyMomentDetail(moment) } 
        });
    } catch (error) {
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


