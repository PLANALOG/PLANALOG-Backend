import { createMoment } from "../repositories/moment.repository.js";
import { responseFromCreateMoment } from "../dtos/moment.dto.js";

export const momentCreate = async (data) => {
    try {
        if (data.status === "draft" && !data.title) {
            console.info("임시저장하시겠습니까? 필요한 경우 제목을 나중에 추가할 수 있습니다.");
        }

        // Moment 생성 (레포지토리에서 Planner ID 검증 & Moment 조회까지 수행)
        const createdMoment = await createMoment(data);

        if (!createdMoment) {
            throw new Error("Moment 생성에 실패했습니다.");
        }

        return responseFromCreateMoment(createdMoment, data.plannerId || null);
    } catch (error) {
        console.error("Moment 생성 중 오류 발생:", error.message);
        throw new Error("Moment 생성에 실패했습니다. 다시 시도해주세요.");
    }
};
