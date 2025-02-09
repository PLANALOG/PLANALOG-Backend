import { StatusCodes } from "http-status-codes";
import { plannerDisplay, plannerCalendarList, plannerDelete } from "../services/planner.service.js";
import { validationError } from "../validator.js";
import { MissingDateInfoError } from "../errors.js";


export const handleDisplayPlanner = async (req, res, next) => {
    /* 
    #swagger.tags = ['Planners']
    #swagger.summary = '플래너 조회 API'
    #swagger.description = `플래너 조회 API입니다. <br>  userId가 있을 경우, 그 사용자의 플래너를 조회합니다. userId가 없을 경우, 로그인한 사용자의 플래너를 조회합니다.  <br>
    date를 입력할 경우 (Ex. date=2025-01-01) : 해당 날짜의 플래너를 조회합니다.  <br>
    month를 입력할 경우 (Ex.month=2025-01): 해당 월의 플래너를 조회합니다. 플래너 뷰에서 필요한 date, isCompleted 데이터만만 반환합니다.`
    #swagger.security = [{
        "bearerAuth": []
    }]
    */

    let userId = 0;

    //유효성 검사 에러 반환
    validationError(req);

    if (req.query.userId) { // query에 userId가 있을 때 : 해당 userId 사용 
        userId = parseInt(req.query.userId);
    } else { // query에 userId가 없을 때 : req.user를 userId로 사용, req.user 없으면 에러 반환 
        if (!req.user || !req.user.id) {
            throw new AuthError();
        }
        userId = req.user.id;
    };


    // date가 있다면 date로 작업
    // month 가 있다면 month 로 작업
    // else : 날짜정보가 누락되었습니다. date 혹은 month 정보를 입력해주세요.
    if (req.query.date) {
        console.log("플래너 조회를 요청했습니다.");

        const plannerDate = new Date(req.query.date); //'yyyy-mm-dd 형식'

        const plannerWithTasks = await plannerDisplay(userId, plannerDate);

        res.status(StatusCodes.OK).success(plannerWithTasks);

    } else if (req.query.month) {
        console.log("캘린더뷰의 플래너 조회를 요청했습니다.");

        const plannerMonth = new Date(req.query.month); // req.query.month 유효성검사 필수

        const plannerCalendarView = await plannerCalendarList(userId, plannerMonth);

        res.status(StatusCodes.OK).success(plannerCalendarView);
    } else {
        if (!req.query.date) throw new MissingDateInfoError();
    };
}

export const handleDeletePlanner = async (req, res, next) => {
    /*
    #swagger.tags = ['Planners']
    #swagger.summary = '플래너 삭제 API'
    #swagger.security = [{
        "bearerAuth": []
    }]
    */

    console.log("플래너 삭제를 요청했습니다.")

    //유효성 검사 에러 반환
    validationError(req);

    if (!req.user || !req.user.id) {
        throw new AuthError();
    }

    const userId = parseInt(req.user.id)

    const plannerId = parseInt(req.params.plannerId);

    const planner = await plannerDelete(plannerId, userId);

    res.status(StatusCodes.OK).success({ plannerId: planner.id });
}
