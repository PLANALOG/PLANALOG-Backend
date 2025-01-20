import { createMoment, updateMoment } from "../repositories/moment.repository.js";
import { responseFromCreateMoment, responseFromUpdateMoment } from "../dtos/moment.dto.js";

import { createMoment } from "../repositories/moment.repository.js";
import { responseFromCreateMoment } from "../dtos/moment.dto.js";
import { prisma } from "../db.config.js";

export const momentCreate = async (data) => {
    try {
        // 1. draft 상태에서 제목과 내용이 없는 경우 안내 메시지 출력
        if (data.status === "draft" && !data.title && !data.content) {
            console.info("임시저장하시겠습니까? 필요한 경우 제목이나 내용을 나중에 추가할 수 있습니다.");
        }

        // 2. Planner 연결 유효성 검증 (선택적)
        let planner = null;
        if (data.plannerId) {
            planner = await prisma.planner.findUnique({
                where: { id: data.plannerId },
            });

            if (!planner) {
                throw new Error("해당 Planner를 찾을 수 없습니다. 올바른 plannerId를 입력해주세요.");
            }
        }

        // 3. Moment 생성 (ID 반환)
        const createdMomentId = await createMoment(data);

        // 4. 생성된 ID로 Moment 조회
        const createdMoment = await prisma.moment.findUnique({
            where: { id: createdMomentId },
            include: { 
                post: true, 
                momentContents: true,
            },
        });

        // 5. 생성된 Moment 검증
        if (!createdMoment) {
            throw new Error("생성된 Moment를 찾을 수 없습니다.");
        }

        // 6. 응답 데이터 변환 (Planner 정보 포함)
        return responseFromCreateMoment(createdMoment, data.plannerId || null);
    } catch (error) {
        // 7. 에러 처리
        console.error("Moment 생성 중 오류 발생:", error.message);
        throw new Error("Moment 생성에 실패했습니다. 다시 시도해주세요.");
    }
};






