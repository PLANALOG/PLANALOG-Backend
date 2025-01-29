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

//momentId X
export class MomentIdNotFoundError extends Error{
  errorCode = "C001";

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
