import { getPlannerWithTasks, getMonthPlanners } from "../repositories/planner.repository.js";
import { responseFromPlannerWithTasks, responseFromPlannerCalendarView } from "../dtos/planner.dto.js";


export const plannerDisplay = async (userId, plannerDate) => {

    const plannerWithTasks = await getPlannerWithTasks(userId, plannerDate);

    if (!plannerWithTasks) {
        // 해당 플래너가 존재하지 않아도 문제는 없음 -> 에러대신 null값 담아 정상응답 
        return plannerWithTasks;
    }

    return responseFromPlannerWithTasks(plannerWithTasks);
};

export const plannerCalendarList = async (userId, plannerMonth) => {

    let plannerNextMonth = new Date(plannerMonth);
    plannerNextMonth.setMonth(plannerMonth.getMonth() + 1);

    const plannerCalendarList = await getMonthPlanners(userId, plannerMonth, plannerNextMonth);

    return responseFromPlannerCalendarView(plannerCalendarList, plannerMonth, plannerNextMonth);
}