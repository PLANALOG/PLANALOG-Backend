import { StatusCodes } from "http-status-codes";
import { bodyToCreateMoment } from "../dtos/moment.dto.js";
import { momentCreate } from "../services/moment.service.js";

export const handleCreateMoment = async (req, resizeBy, next) => {
    try {
        console.log("moment 생성요청");
        const momentData = await momentCreate(bodyToCreateMoment(req.body, req.query.userId));
        res.status(StatusCodes.OK).success(momentData); 
    } catch (error) {
        next(error);
    }
};