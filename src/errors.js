export class UserWithOtherPlatformError extends Error {
  errorCode = "U001";

  constructor(data) {
    const reason = `${data.name}님은 이미 ${data.platform}으로 가입된 계정이 있습니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
} 
 
 export class DuplicateLikePostError extends Error{
  errorCode = "L001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
 }
 export class LikePostIdNotExistError extends Error{
  errorCode = "L002";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
 }