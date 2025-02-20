import { StatusCodes } from "http-status-codes";
import { 
    bodyToCreateMoment, 
    bodyToUpdateMoment,
    responseFromMyMomentDetail, 
    responseFromOtherUserMoments, 
    responseFromOtherUserMomentDetail  } from "../dtos/moment.dto.js";
import { 
    momentCreate, 
    momentUpdate, 
    momentDelete,
    getMyMoments, 
    getMyMomentDetail, 
    getOtherUserMoments, 
    getOtherUserMomentDetail  } from "../services/moment.service.js";


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

        const responseData = await getMyMoments(req.user.id);  

        console.log(" 최종 반환할 데이터:", JSON.stringify(responseData, null, 2));

        res.status(200).json({
            resultType: "SUCCESS",
            error: null,
            success: { data: responseData }
        });
    } catch (error) {
        console.error("응답 반환 중 오류 발생:", error);
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
        console.error("Moment 상세 조회 오류:", error.message);  //  에러 로그 추가
        next(error);
    }
};

export const handleGetOtherUserMoments = async (req, res, next) => {

    /*
    #swagger.tags = ['Moments']
    #swagger.summary = '특정 사용자의 Moment 목록 조회 API'
    #swagger.description = '특정 사용자의 페이지에서 해당 사용자의 Moment 게시물 목록을 조회합니다.'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['userId'] = {
        in: "path",
        required: true,
        description: "조회할 사용자의 ID",
        schema: { type: "integer", example: 2 }
    }
*/

    try {

        // userId 확인: 잘못된 값이 전달되는지 확인
        const userId = Number(req.params.userId);
        console.log("Received userId from params:", req.params.userId); // 확인용 로그 추가
        if (isNaN(userId)) {
            throw new Error("유효하지 않은 사용자 ID입니다.");
        }

        // getOtherUserMoments 함수에서 userId 확인
        const responseData = await getOtherUserMoments(userId);

        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: { data: responseData }
        });

    } catch (error) {
        console.error("❌ 특정 사용자의 Moment 목록 조회 오류:", error);
        next(error);
    }
};









export const handleGetOtherUserMomentDetail = async (req, res, next) => {
    /*
        #swagger.tags = ['Moments']
        #swagger.summary = '특정 사용자의 특정 Moment 상세 조회 API'
        #swagger.description = '특정 사용자의 페이지에서 특정 Moment 게시물의 상세 정보를 조회합니다.'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['userId'] = {
            in: "path",
            required: true,
            description: "조회할 사용자의 ID",
            schema: { type: "integer", example: 1234 }
        }
        #swagger.parameters['momentId'] = {
            in: "path",
            required: true,
            description: "조회할 Moment의 ID",
            schema: { type: "integer", example: 456 }
        }
    */

    try {
        console.log("특정 사용자의 Moment 목록 조회 요청");

        const userId = parseInt(req.params.userId, 10);
        if (isNaN(userId)) {
            throw new Error("유효하지 않은 사용자 ID입니다.");
        }

        const moments = await getOtherUserMoments(userId);

        // 🔍 responseFromOtherUserMoments() 변환 결과 확인
        const responseData = responseFromOtherUserMoments(moments);
        console.log("Swagger 응답 데이터:", JSON.stringify(responseData, null, 2));

        res.status(StatusCodes.OK).json({
            resultType: "SUCCESS",
            error: null,
            success: {
                data: responseData
            }
        });
    } catch (error) {
        console.error("특정 사용자의 Moment 목록 조회 오류:", error);
        next(error);
    }
};

