export class UserWithOtherPlatformError extends Error {
  errorCode = "U001";

  constructor(data) {
    const reason = `${data.name}님은 이미 ${data.platform}으로 가입된 계정이 있습니다.`
    super(reason);
    this.reason = reason;
    this.data = data;
  }
} 
 
//중복 좋아요
 export class DuplicateLikePostError extends Error{
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

 //본인이 누른 좋아요 X
 export class LikeNotOwnedByUserError extends Error{
  errorCode = "L003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
 }
}

//postId X
export class PostIdNotFoundError extends Error{
  errorCode = "C001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}

//중복 좋아요
export class DuplicateLikePostError extends Error{
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

 //본인이 누른 좋아요 X
 export class LikeNotOwnedByUserError extends Error{
  errorCode = "L003";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
 }
}

//postId X
export class PostIdNotFoundError extends Error{
  errorCode = "C001";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}


export class LikeIdMissingError extends Error{
  errorCode = "L004";

  constructor(reason, data) {
    super(reason);
    this.reason = reason;
    this.data = data;
  }
}