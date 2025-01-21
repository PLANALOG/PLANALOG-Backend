import { StatusCodes } from "http-status-codes";
import { bodyToCreateMoment, bodyToUpdateMoment } from "../dtos/moment.dto.js";
import { momentCreate, momentUpdate, momentDelete } from "../services/moment.service.js";

export const handleMomentCreate = async (req, res, next) => {
    /*
    #swagger.summary = 'Moment 생성 API';
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "25년 1월7일" },
                        status: { type: "string", enum: ["draft", "public"], example: "draft" },
                        textAlign: { type: "string", enum: ["left", "center", "right"], example: "left" },
                        content: { type: "string", example: "오늘은 정말 행복한 하루였어요!" },
                        images: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    url: { type: "string", example: "https://image1.com/image1.jpg" },
                                    sortOrder: { type: "number", example: 1 }
                                }
                            }
                        },
                        plannerId: { type: "number", example: 789 } // Planner ID 추가
                    }
                }
            }
        }
    };
    */

    try {
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const userId = req.user.id;

                // 요청 데이터를 변환하여 Planner ID 포함
        const momentData = bodyToCreateMoment({
            ...req.body,
            userId,
            plannerId: req.body.plannerId || null, // Planner ID 처리
        });

        const createdMoment = await momentCreate(momentData);

        res.status(StatusCodes.OK).success(createdMoment);
    } catch (error) {
        next(error);
    }
};

export const handleMomentUpdate = async (req, res, next) => {
    /*
    #swagger.summary = 'Moment 수정 API';
    #swagger.parameters['momentId'] = {
        in: 'path',
        required: true,
        description: '수정할 Moment의 ID'
    };
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "수정된 제목" },
                        content: { type: "string", example: "수정된 내용" },
                        status: { type: "string", enum: ["draft", "public"], example: "public" },
                        plannerId: { type: "number", example: 123 },
                        textAlign: { type: "string", enum: ["left", "center", "right"], example: "center" }
                    }
                }
            }
        }
    };
    */

    try {
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const userId = req.user.id;

        const momentData = bodyToUpdateMoment({
            ...req.body,
            momentId: req.params.momentId,
            userId,
        });

        const updatedMoment = await momentUpdate(momentData);

        res.status(StatusCodes.OK).success(updatedMoment);
    } catch (error) {
        next(error);
    }
};

export const handleMomentDelete = async (req, res, next) => {
    /*
    #swagger.summary = 'Moment 삭제 API';
    #swagger.parameters['momentId'] = {
        in: 'path',
        required: true,
        description: '삭제할 Moment의 ID'
    };
    */

    try {
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
        }

        const userId = req.user.id;
        const momentId = req.params.momentId;

        const deletedMoment = await momentDelete({ userId, momentId });

        res.status(StatusCodes.OK).success(deletedMoment);
    } catch (error) {
        next(error);
    }
};



