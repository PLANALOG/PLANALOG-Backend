import { 
    createMoment, 
    updateMoment, 
    deleteMomentFromDB, 
    findMyMoments, 
    findAllMomentsForDebug,
    findMyMomentDetail, 
    findFriendsMoments, 
    findFriendMomentDetail 
} from "../repositories/moment.repository.js";

import { 
    responseFromCreateMoment, 
    responseFromUpdateMoment, 
    responseFromMyMoments, 
    responseFromMyMomentDetail, 
    responseFromFriendsMoments, 
    responseFromFriendMomentDetail 
} from "../dtos/moment.dto.js";

export const momentCreate = async (data) => {
    try {
        if (data.status === "draft" && !data.title) {
            console.info("임시저장하시겠습니까? 필요한 경우 제목을 나중에 추가할 수 있습니다.");
        }

        const createdMoment = await createMoment(data);

        if (!createdMoment) {
            throw new Error("Moment 생성에 실패했습니다.");
        }

        return responseFromCreateMoment(createdMoment, data.plannerId || null);
    } catch (error) {
        console.error("Moment 생성 중 오류 발생:", error.message);
        throw new Error(error.message || "Moment 생성에 실패했습니다. 다시 시도해주세요.");
    }
};



export const momentUpdate = async (momentId, data) => {
    try {
        if (!momentId) {
            throw new Error("Moment ID가 필요합니다.");
        }

        if (data.status === "draft" && !data.title) {
            console.info("임시저장하시겠습니까? 필요한 경우 제목을 나중에 추가할 수 있습니다.");
        }

        const updatedMoment = await updateMoment(momentId, data);

        if (!updatedMoment) {
            throw new Error("Moment 수정에 실패했습니다.");
        }

        return responseFromUpdateMoment(updatedMoment);
    } catch (error) {
        console.error("Moment 수정 중 오류 발생:", error.message);
        throw new Error("Moment 수정에 실패했습니다. 다시 시도해주세요.");
    }
};

export const momentDelete = async (momentId) => {
    try {
        if (!momentId) {
            throw new Error("Moment ID가 필요합니다.");
        }

        console.log(`Moment 삭제 요청: momentId=${momentId}`);

        const isDeleted = await deleteMomentFromDB(momentId);

        if (!isDeleted) {
            throw new Error("Moment 삭제에 실패했습니다.");
        }

        return momentId;
    } catch (error) {
        console.error("Moment 삭제 중 오류 발생:", error.message);
        throw new Error("Moment 삭제에 실패했습니다. 다시 시도해주세요.");
    }
};



export const getMyMoments = async (userId) => {
    try {
        const myMoments = await findMyMoments(userId);
        const allMoments = await findAllMomentsForDebug(); // ✅ 모든 데이터 조회

        console.log("현재 로그인한 사용자의 Moments:", JSON.stringify(myMoments, null, 2));
        console.log("DB에 존재하는 모든 Moments:", JSON.stringify(allMoments, null, 2));

        return responseFromMyMoments(myMoments);
    } catch (error) {
        console.error("나의 Moment 목록 조회 오류:", error);
        throw new Error("Moment 목록 조회 실패");
    }
};





export const getMyMomentDetail = async (userId, momentId) => {
    try {
        console.log("조회 요청 - userId:", userId, "momentId:", momentId); // ✅ 추가된 로그

        const momentDetail = await findMyMomentDetail(userId, momentId);
        console.log("DB 조회 결과:", momentDetail); // ✅ DB 결과 확인

        if (!momentDetail) {
            throw new Error("Moment를 찾을 수 없습니다.");
        }

        return responseFromMyMomentDetail(momentDetail);
    } catch (error) {
        console.error("나의 Moment 상세 조회 중 오류 발생:", error.message);
        throw new Error("나의 Moment 상세 조회에 실패했습니다. 다시 시도해주세요.");
    }
};



export const getFriendsMoments = async (userId) => {
    try {
        const friendsMoments = await findFriendsMoments(userId);

        if (!friendsMoments) {
            throw new Error("친구의 Moment 목록 조회에 실패했습니다.");
        }

        return responseFromFriendsMoments(friendsMoments);
    } catch (error) {
        console.error("친구의 Moment 목록 조회 중 오류 발생:", error.message);
        throw new Error("친구의 Moment 목록 조회에 실패했습니다. 다시 시도해주세요.");
    }
};

export const getFriendMomentDetail = async (userId, momentId) => {
    try {
        const friendMomentDetail = await findFriendMomentDetail(userId, momentId);

        if (!friendMomentDetail) {
            throw new Error("친구의 Moment 상세 조회에 실패했습니다.");
        }

        return responseFromFriendMomentDetail(friendMomentDetail);
    } catch (error) {
        console.error("친구의 Moment 상세 조회 중 오류 발생:", error.message);
        throw new Error("친구의 Moment 상세 조회에 실패했습니다. 다시 시도해주세요.");
    }
};
