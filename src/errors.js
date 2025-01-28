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

export class PostIdNotFoundError extends Error{
  errorCode = "C001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

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