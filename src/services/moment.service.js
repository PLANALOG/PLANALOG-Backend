import { 
    createMoment, 
    updateMoment, 
    deleteMomentFromDB, 
    findMyMoments, 
    findMyMomentDetail, 
    findOtherUserMoments, 
    findOtherUserMomentDetail 
} from "../repositories/moment.repository.js";

import { 
    responseFromCreateMoment, 
    responseFromUpdateMoment, 
    responseFromMyMoments, 
    responseFromMyMomentDetail, 
    responseFromOtherUserMoments, 
    responseFromOtherUserMomentDetail 
} from "../dtos/moment.dto.js";

import {
  InvalidPlannerIdError,
  MissingTitleError,
  MissingMomentContentError,
  MissingContentInPageError,
  DuplicateSortOrderError,
  MomentServerError,
  UnauthorizedAccessError,
  InvalidMomentIdError,
  MomentNotFoundError
} from "../errors.js";


export const momentCreate = async (data) => {
  try {
    // 유효성 검사
    if (!data.title) {
      throw new MissingTitleError();
    }

    if (!Array.isArray(data.momentContents) || data.momentContents.length === 0) {
      throw new MissingMomentContentError();
    }

    if (data.momentContents.some(content => !content.content || content.content.trim() === '')) {
      throw new MissingContentInPageError();
    }

    const sortOrders = data.momentContents.map(content => content.sortOrder);
    if (new Set(sortOrders).size !== sortOrders.length) {
      throw new DuplicateSortOrderError();
    }


    // Moment 생성 
    const createdMoment = await createMoment(data);


    // 클라이언트에 반환할 데이터 변환
    return responseFromCreateMoment(createdMoment);

  } catch (error) {
    console.error("Moment 생성 중 오류 발생:", error);

    // 에러 처리 (예상치 못한 에러를 서버 오류로 래핑)
    if (error instanceof MissingTitleError ||
        error instanceof MissingMomentContentError ||
        error instanceof MissingContentInPageError ||
        error instanceof DuplicateSortOrderError ||
        error instanceof InvalidPlannerIdError) {
      throw error;  // 유효성 오류는 그대로 전달
    }

    // 예상치 못한 오류를 서버 에러로 처리
    throw new MomentServerError();
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
        // 인증되지 않은 사용자 처리
        if (!userId) {
            throw new UnauthorizedAccessError();
        }

        const myMoments = await findMyMoments(userId);

        return responseFromMyMoments(myMoments);
    } catch (error) {
        console.error("나의 Moment 목록 조회 오류:", error);

        if (error instanceof UnauthorizedAccessError) {
            throw error;
        }

        // 기타 예상치 못한 오류는 서버 오류로 처리
        throw new MomentServerError();
    }
};



export const getMyMomentDetail = async (userId, momentId) => {
    try {
        // 유효하지 않은 momentId 체크
        if (isNaN(momentId) || !Number.isInteger(Number(momentId))) {
            throw new InvalidMomentIdError(momentId);
        }

        const momentDetail = await findMyMomentDetail(userId, BigInt(momentId));

        // 존재하지 않는 momentId 체크
        if (!momentDetail) {
            throw new MomentNotFoundError(momentId);
        }

        return responseFromMyMomentDetail(momentDetail);
    } catch (error) {
        console.error("나의 Moment 상세 조회 중 오류 발생:", error.message);

        // 존재하지 않는 moment 에러
        if (error instanceof MomentNotFoundError || error instanceof InvalidMomentIdError) {
            throw error;
        }

        // 기타 예상치 못한 오류는 서버 오류로 처리
        throw new MomentServerError("나의 Moment 상세 조회에 실패했습니다. 다시 시도해주세요.", { error });
    }
};


export const getOtherUserMoments = async (userId) => {
    try {
        // 인증되지 않은 사용자 처리
        if (!userId) {
            throw new UnauthorizedAccessError();
        }

        const otherUsersMoments = await findOtherUserMoments(userId);

        return responseFromOtherUserMoments(otherUsersMoments);
    } catch (error) {
        console.error("다른사람의 Moment 목록 조회 중 오류 발생:", error);

        if (error instanceof UnauthorizedAccessError) {
            throw error;
        }

        // 기타 예상치 못한 오류는 서버 오류로 처리
        throw new MomentServerError();
    }
};


export const getOtherUserMomentDetail = async (userId, momentId) => {
    try {
        // 유효하지 않은 momentId 체크
        if (isNaN(momentId) || !Number.isInteger(Number(momentId))) {
            throw new InvalidMomentIdError(momentId);
        }

        const otherUserMomentDetail = await findOtherUserMomentDetail(userId, BigInt(momentId));

        // 존재하지 않는 momentId 체크
        if (!otherUserMomentDetail) {
            throw new MomentNotFoundError(momentId);
        }

        return responseFromOtherUserMomentDetail(otherUserMomentDetail);
    } catch (error) {
        console.error("친구의 Moment 상세 조회 중 오류 발생:", error.message);

        // 존재하지 않는 moment 에러
        if (error instanceof MomentNotFoundError || error instanceof InvalidMomentIdError) {
            throw error;
        }

        // 기타 예상치 못한 오류는 서버 오류로 처리
        throw new MomentServerError("다른 사용자의의 Moment 상세 조회에 실패했습니다. 다시 시도해주세요.", { error });
    }
};

