import { StatusCodes } from "http-status-codes";
import { plannerDisplay } from "../services/planner.service.js";


export const handleDisplayPlanner = async (req, res, next) => {

    console.log("플래너 조회를 요청했습니다.");

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

    if (!req.query.date) throw new Error("날짜 정보가 누락되었습니다 :  ?date=2025-01-15")

    const plannerDate = new Date(req.query.date); //'yyyy-mm-dd 형식'


    const plannerWithTasks = await plannerDisplay(userId, plannerDate);

    // 관련 플래너가 없으면 성공응답에 null값 전달 
    if (!plannerWithTasks) res.status(StatusCodes.OK).success(null);
    else res.status(StatusCodes.OK).success(plannerWithTasks);
}
