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

export class authError extends Error {
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
    const reason = `플래너를 삭제할 권한이 없습니다. 본인의 플래너만 삭제할 수 있습니다.`
    super(reason);
    this.reason = reason;
  }
}

export class MissingDateInfoError extends Error {
  errorCode = "P003";
  statusCode = 400; // Bad Request: 날짜 정보 누락

  constructor() {
    const reason = `날짜정보가 누락되었습니다. date 혹은 month 정보를 입력해주세요. :  ?date=2025-01-15, ?month=2025-01`
    super(reason);
    this.reason = reason;
  }
}