import { getPlannerWithTasks } from "../repositories/planner.repository.js";
import { responseFromPlannerWithTasks } from "../dtos/planner.dto.js";


export const plannerDisplay = async (userId, plannerDate) => {

    const plannerWithTasks = await getPlannerWithTasks(userId, plannerDate);
    ;
    console.log(plannerWithTasks)

    if (!plannerWithTasks) {
        // 해당 플래너가 존재하지 않아도 문제는 없음 -> 에러대신 null값 담아 정상응답 
        return plannerWithTasks;
    }

    return responseFromPlannerWithTasks(plannerWithTasks);
};