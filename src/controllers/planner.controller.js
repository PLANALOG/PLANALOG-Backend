import { StatusCodes } from "http-status-codes";
import { plannerDisplay, plannerCalendarList, plannerDelete } from "../services/planner.service.js";


export const handleDisplayPlanner = async (req, res, next) => {

    let userId = 0;

    console.log(req.user)

    if (req.query.userId) { // query에 userId가 있을 때 : 해당 userId 사용 
        userId = parseInt(req.query.userId);
    } else { // query에 userId가 없을 때 : req.user를 userId로 사용, req.user 없으면 에러 반환 
        if (!req.user || !req.user.id) {
            throw new Error("사용자 인증 정보가 누락되었습니다.");
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

        // 관련 플래너가 없으면 성공응답에 null값 전달 
        if (!plannerWithTasks) res.status(StatusCodes.OK).success(null);
        else res.status(StatusCodes.OK).success(plannerWithTasks);

    } else if (req.query.month) {
        console.log("캘린더뷰의 플래너 조회를 요청했습니다.");

        const plannerMonth = new Date(req.query.month); // req.query.month 유효성검사 필수

        const plannerCalendarView = await plannerCalendarList(userId, plannerMonth);

        res.status(StatusCodes.OK).success(plannerCalendarView);
    } else {
        if (!req.query.date) throw new Error("날짜정보가 누락되었습니다. date 혹은 month 정보를 입력해주세요. :  ?date=2025-01-15, ?month=2025-01 ")
    };
}

export const handleDeletePlanner = async (req, res, next) => {
    /*
    #swagger.summary = '플래너 삭제 API'
    #swagger.parameters['plannerId'] = {
        in: 'path',
        description: '삭제할 플래너의 ID',
        required: true,
        schema: {
            plannerId : 
        }
    }
    */

    console.log("플래너 삭제를 요청했습니다.")

    if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 누락되었습니다.");
    }

    const userId = parseInt(req.user.id)

    const plannerId = parseInt(req.params.plannerId);

    const planner = await plannerDelete(plannerId, userId);

    res.status(StatusCodes.OK).success({ plannerId: planner.id });
}
