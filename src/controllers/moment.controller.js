import { StatusCodes } from "http-status-codes";
import { bodyToCreateMoment, bodyToUpdateMoment } from "../dtos/moment.dto.js";
import { momentCreate, momentUpdate } from "../services/moment.service.js";

export const handleCreateMoment = async (req, res, next) => {
    /*
    #swagger.tags = ['Moments']
    #swagger.summary = 'Moment 생성 API'
    #swagger.description = '새로운 Moment를 생성합니다.'
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
                                            momentContentId: { type: "integer", example: 1, description: "Moment 페이지 ID" },
                                            content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "Moment 페이지 내용" },
                                            url: { type: "string", nullable: true, example: null, description: "이미지 URL" }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            momentContentId: { type: "integer", example: 2, description: "Moment 페이지 ID" },
                                            content: { type: "string", example: "카페에서 공부 중 ☕", description: "Moment 페이지 내용" },
                                            url: { type: "string", example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            momentContentId: { type: "integer", example: 3, description: "Moment 페이지 ID" },
                                            content: { type: "string", example: "독서실에서 마지막 정리!", description: "Moment 페이지 내용" },
                                            url: { type: "string", nullable: true, example: null, description: "이미지 URL" }
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
                                        id: { type: "integer", example: 456, description: "생성된 Moment의 ID" },
                                        userId: { type: "integer", example: 5, description: "생성한 사용자 ID" },
                                        plannerId: { type: "integer", example: 123, description: "Planner ID" },
                                        title: { type: "string", example: "25년 1월 7일", description: "Moment 제목" },
                                        status: { type: "string", example: "draft", description: "Moment 상태" },
                                        createdAt: { type: "string", format: "date-time", example: "2025-01-21T12:34:56Z", description: "Moment 생성 시간" },
                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-21T13:00:00Z", description: "Moment 수정 시간" },
                                        contents: {
                                            type: "array",
                                            items: {
                                                oneOf: [
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            momentContentId: { type: "integer", example: 1, description: "Moment 페이지 ID" },
                                                            content: { type: "string", example: "오늘 하루 열심히 공부했어요!", description: "Moment 페이지 내용" },
                                                            url: { type: "string", nullable: true, example: null, description: "이미지 URL" }
                                                        }
                                                    },
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            momentContentId: { type: "integer", example: 2, description: "Moment 페이지 ID" },
                                                            content: { type: "string", example: "카페에서 공부 중 ☕", description: "Moment 페이지 내용" },
                                                            url: { type: "string", example: "https://image1.com/image1.jpg", description: "이미지 URL" }
                                                        }
                                                    },
                                                    {
                                                        type: "object",
                                                        properties: {
                                                            momentContentId: { type: "integer", example: 3, description: "Moment 페이지 ID" },
                                                            content: { type: "string", example: "독서실에서 마지막 정리!", description: "Moment 페이지 내용" },
                                                            url: { type: "string", nullable: true, example: null, description: "이미지 URL" }
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
    }
    */
    try {
        console.log("moment 생성요청");
        const momentData = await momentCreate(bodyToCreateMoment(req.body, req.query.userId));
        res.status(StatusCodes.OK).success(momentData);
    } catch (error) {
        next(error);
    }
};


export const handleUpdateMoment = async (req, res, next) => {
    /*
    #swagger.tags = ['Moments']
    #swagger.summary = 'Moment 수정 API'
    #swagger.description = '기존의 Moment를 수정합니다.'
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
                                            momentContentId: { type: "integer", example: 2, description: "수정할 페이지 ID" },
                                            content: { type: "string", example: "수정된 내용 (기존 페이지)", description: "수정된 페이지 내용" },
                                        }
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            momentContentId: { type: "integer", nullable: true, example: null, description: "수정할 페이지 ID" },
                                            content: { type: "string", example: "새로 추가된 페이지(2번째와 3번째 사이 삽입)", description: "수정할 페이지 ID)" },
                                            insertAfterId: { type: "integer",  example: 2, description: "새로운 페이지를 추가할 경우, 삽입할 위치의 ID" }
                                        }
                                    }
                                ]
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
                                        id: { type: "integer", example: 123, description: "수정된 Moment ID" },
                                        title: { type: "string", example: "수정된 제목", description: "수정된 Moment 제목" },
                                        status: { type: "string", enum: ["draft", "public"], example: "public", description: "수정된 Moment 상태" },
                                        plannerId: { type: "integer", nullable: true, example: null, description: "연결된 Planner ID (없을 경우 null)" },
                                        updatedAt: { type: "string", format: "date-time", example: "2025-01-11T12:34:56Z", description: "수정된 시간" },
                                        momentContents: {
                                            type: "array",
                                                items: {
                                                    oneOf: [
                                                            {    
                                                                type: "object",
                                                                properties: {
                                                                    momentContentId: { type: "integer", example: 2, description: "Moment 콘텐츠 ID" },
                                                                    content: { type: "string", example: "수정된 내용 (기존 페이지)", description: "Moment 콘텐츠 내용" }
                                                                }
                                                            },
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    momentContentId: { type: "integer", example: 5, description: "Moment 콘텐츠 ID" },
                                                                    content: { type: "string", example: "새로 추가된 페이지(2번째와 3번째 사이 삽입)", description: "Moment 콘텐츠 내용" }
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
    }

    */
    try {
        console.log("moment 수정요청");
        const momentData = await momentUpdate(bodyToUpdateMoment(req.body, req.query.userId));
        res.status(StatusCodes.OK).success(momentData);
    } catch (error) {
        next(error);
    }
};