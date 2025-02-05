import { validationResult } from "express-validator";
import { CustomValidationError } from "./errors.js";

//유효성 검사 에러 반환

export const validationError = (req) => {
    if (!validationResult(req).isEmpty()) {
        const errorsMessages = validationResult(req).array().map((error) => error.msg);
        //자바스크립트에서 배열을 문자열로 변환하려고 하면 암묵적으로 Array.prototype.toString 메서드가 호출
        throw new CustomValidationError(errorsMessages)
    }
}