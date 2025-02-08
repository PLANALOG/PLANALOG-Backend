/* 예시 코드 
export class DuplicateUserEmailError extends Error {
    errorCode = "U001";
  
    constructor(reason, data) {
      super(reason);
      this.reason = reason;
      this.data = data;
    }
  } 
  */

export class UserWithOtherPlatformError extends Error {
  errorCode = "U001";
  statusCode = 400; // Bad Request: 다른 플랫폼으로 가입된 계정

  constructor(data) {
    const reason = `${data.name}님은 이미 ${data.platform}으로 가입된 계정이 있습니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DuplicateUserNicknameError extends Error {
  errorCode = "U002";
  statusCode = 400; //Bad Request : 클라이언트 요청이 잘못 됨 

  constructor(data) {
    const reason = "이미 존재하는 닉네임입니다."
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoExistsUserError extends Error {
  errorCode = "U003";
  statusCode = 404; // Not Found: 존재하지 않는 사용자

  constructor(data) {
    const reason = `존재하지 않는 사용자입니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class DeletedUserError extends Error {
  errorCode = "U004";
  statusCode = 403; // Forbidden: 탈퇴한 회원은 접근할 수 없음


  constructor(data) {
    const reason = `탈퇴한 회원입니다. ${data.leftDays}일 후에 재가입할 수 있습니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class InvalidOrExpiredTokenError extends Error {
  errorCode = "A001";
  statusCode = 403; // Forbidden: 유효하지 않거나 만료된 토큰

  constructor() {
    const reason = "유효하지 않거나 만료된 토큰입니다. 다시 로그인해주세요.";
    super(reason);
    this.reason = reason;
  }
}

export class MissingAuthorizationHeaderError extends Error {
  errorCode = "A002";
  statusCode = 401; // 401 Unauthorized: Authorization 헤더 누락

  constructor() {
    const reason = "Authorization 헤더가 누락되었습니다. 인증이 필요합니다.";
    super(reason);
    this.reason = reason;
  }
}

export class AuthError extends Error {
  errorCode = "A003";
  statusCode = 401;

  constructor() {
    const reason = `사용자 인증 정보가 누락되었습니다. 로그인 후 이용해주세요.`
    super(reason);
    this.reason = reason;
  }
}

export class InvalidSocialAccessTokenError extends Error {
  errorCode = "OAUTH001"; // OAuth 관련 에러
  statusCode = 401; // Unauthorized: 잘못된 Social Access Token

  constructor(platform) {
    const reason = `입력된 Access Token으로 ${platform} 계정에서 이메일 정보를 가져올 수 없습니다.`;
    super(reason);
    this.reason = reason;
    this.data = null;
  }
}

export class InvalidSocialRefreshTokenError extends Error {
  errorCode = "OAUTH002"; // OAuth 관련 에러
  statusCode = 401; // Unauthorized: 잘못된 Social Refresh Token

  constructor(data) {
    let reason;
    if (data === "noExist") {
      reason = "DB에 유저의 소셜 리프레시 토큰이 저장되어 있지 않습니다."
    } else {
      reason = `DB에 저장된 유저의 Social Refresh Token으로 ${data} 연결 끊기에 실패했습니다. refresh token을 재발급 해주세요.`;
    }
    super(reason);
    this.reason = reason;
    this.data = null;
  }
}


// 요청 데이터 유효성 검사 에러 
export class CustomValidationError extends Error {
  errorCode = "V001"; // Validation
  statusCode = 400; // Bad Request : 클라이언트 요청이 잘못 됨 

  constructor(data) {
    const reason = `입력 정보가 유효하지 않습니다.`;
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//중복 좋아요
export class DuplicateLikeMomentError extends Error {
  errorCode = "L001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//좋아요 존재 X
export class LikeIdNotExistError extends Error {
  errorCode = "L002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//권한 없는 좋아요(본인이 누른 좋아요 X)
export class LikeNotOwnedByUserError extends Error {
  errorCode = "L003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//좋아요id 누락
export class LikeIdMissingError extends Error {
  errorCode = "L004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class momentIdNotFoundError extends Error {
  errorCode = "C001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//댓글 내용 공백
export class ContentNotFoundError extends Error {
  errorCode = "C002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class CommentIdNotFoundError extends Error {
  errorCode = "C003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//수정 권한
export class PermissionDeniedError extends Error {
  errorCode = "C004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//500자 이상 댓글
export class ContentTooLongError extends Error {
  errorCode = "C005";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


export class NoExistsPlannerError extends Error {
  errorCode = "P001";
  statusCode = 404; // Not Found: 존재하지 않는 플래너

  constructor() {
    const reason = `존재하지 않는 플래너입니다.`
    super(reason);
    this.reason = reason;
  }
}

export class UnauthorizedPlannerDeletionError extends Error {
  errorCode = "P002";
  statusCode = 403; // Forbidden: 플래너 삭제 권한 없음

  constructor() {
    const reason = `플래너를 삭제할 권한이 없습니다. 본인의 플래너만 삭제할 수 있습니다.`;
    super(reason);
    this.reason = reason;
  }
}
// moment생성 에러처리

// 서버 오류
export class MomentServerError extends Error {
  errorCode = "M001";

  constructor(reason = "서버 오류가 발생했습니다.", data = {}) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 유효하지 않은 plannerId
export class InvalidPlannerIdError extends Error {
  errorCode = "M002";

  constructor(data) {
    const reason = "유효하지 않은 plannerId입니다.";
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 제목 누락
export class MissingTitleError extends Error {
  errorCode = "M003";

  constructor() {
    const reason = "제목을 작성해주세요.";
    super(reason);
    this.reason = reason;
  }
}

export class MissingDateInfoError extends Error {
  errorCode = "P003";
  statusCode = 400; // Bad Request: 날짜 정보 누락

  constructor() {
    const reason = `날짜정보가 누락되었습니다. date 혹은 month 정보를 입력해주세요. :  ?date=2025-01-15, ?month=2025-01`;
    super(reason);
    this.reason = reason;
  }
}

// 페이지 누락
export class MissingMomentContentError extends Error {
  errorCode = "M004";

  constructor() {
    const reason = "최소 하나의 페이지가 존재해야 합니다.";
    super(reason);
    this.reason = reason;
  }
}

// 페이지 내용 누락
export class MissingContentInPageError extends Error {
  errorCode = "M005";

  constructor(data) {
    const reason = "모든 페이지에 빈 내용이 포함될 수 없습니다.";
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

// 중복된 sortOrder
export class DuplicateSortOrderError extends Error {
  errorCode = "M006";

  constructor(data) {
    const reason = "sortOrder 값은 중복될 수 없습니다.";
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
// 사용자 인증 정보가 없을 때 발생
export class UserAuthenticationError extends Error {
  errorCode = "USER001";
  statusCode = 401;

  constructor() {
    const reason = "사용자 인증 정보가 필요합니다.";
    super(reason);
    this.reason = reason;
  }
}

// 사용자 검색 시 검색어가 없을 때 발생
export class MissingSearchQueryError extends Error {
  errorCode = "SEARCH001";
  statusCode = 400;

  constructor() {
    const reason = "검색어를 입력해야 합니다.";
    super(reason);
    this.reason = reason;
  }
}

// 사용자 검색 중 서버 오류 발생
export class SearchUsersError extends Error {
  errorCode = "SEARCH002";
  statusCode = 500;

  constructor(errorMessage) {
    const reason = `사용자 검색 중 서버 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 검색 기록 저장 중 서버 오류 발생
export class SaveSearchRecordError extends Error {
  errorCode = "SEARCH003";
  statusCode = 500;

  constructor(errorMessage) {
    const reason = `검색 기록 저장 중 서버 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 검색 기록 조회 중 서버 오류 발생
export class FetchSearchRecordsError extends Error {
  errorCode = "SEARCH004";
  statusCode = 500;

  constructor(errorMessage) {
    const reason = `검색 기록 조회 중 서버 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 검색 기록 삭제 중 오류 발생
export class DeleteSearchRecordError extends Error {
  errorCode = "SEARCH005";
  statusCode = 400;

  constructor(errorMessage) {
    const reason = `검색 기록 삭제 중 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 알림 생성 중 오류 발생
export class NoticeCreationError extends Error {
  errorCode = "NOTICE001";
  statusCode = 400;

  constructor(errorMessage) {
    const reason = `알림 생성 중 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 알림 읽음 상태 수정 중 오류 발생
export class NoticeUpdateReadStatusError extends Error {
  errorCode = "NOTICE002";
  statusCode = 400;

  constructor(errorMessage) {
    const reason = `알림 읽음 상태 수정 중 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 알림 삭제 중 오류 발생
export class NoticeDeletionError extends Error {
  errorCode = "NOTICE003";
  statusCode = 400;

  constructor(errorMessage) {
    const reason = `알림 삭제 중 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}

// 알림 조회 중 서버 오류 발생
export class NoticeFetchError extends Error {
  errorCode = "NOTICE004";
  statusCode = 400;

  constructor(errorMessage) {
    const reason = `알림 조회 중 서버 오류가 발생했습니다. ${errorMessage}`;
    super(reason);
    this.reason = reason;
  }
}
