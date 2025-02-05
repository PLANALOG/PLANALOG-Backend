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

export class DuplicateUserNicknameError extends Error {
  errorCode = "U002";

  constructor(data) {
    const reason = "이미 존재하는 닉네임입니다."
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class UserWithOtherPlatformError extends Error {
  errorCode = "U001";

  constructor(data) {
    const reason = `${data.name}님은 이미 ${data.platform}으로 가입된 계정이 있습니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class NoExistsUserError extends Error {
  errorCode = "U003";

  constructor(data) {
    const reason = `존재하지 않거나 탈퇴한 사용자입니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class authError extends Error {
  errorCode = "A001";

  constructor() {
    const reason = `사용자 인증 정보가 누락되었습니다. 로그인 후 이용해주세요.`
    super(reason);
    this.reason = reason;
  }
}
//중복 좋아요
export class DuplicateLikeMomentError extends Error{
  errorCode = "L001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
 }
 //좋아요 존재 X
 export class LikeIdNotExistError extends Error{ 
  errorCode = "L002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
 }
 //권한 없는 좋아요(본인이 누른 좋아요 X)
 export class LikeNotOwnedByUserError extends Error{
  errorCode = "L003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
 }
}
//좋아요id 누락
export class LikeIdMissingError extends Error{
  errorCode = "L004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
export class momentIdNotFoundError extends Error{
  errorCode = "C001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//댓글 내용 공백
export class ContentNotFoundError extends Error{
  errorCode = "C002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

export class CommentIdNotFoundError extends Error{
  errorCode = "C003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//수정 권한
export class PermissionDeniedError extends Error{
  errorCode = "C004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}
//500자 이상 댓글
export class ContentTooLongError extends Error{
  errorCode = "C005";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
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