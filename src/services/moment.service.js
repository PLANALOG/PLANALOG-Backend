import { createMoment, updateMoment, deleteMoment, addImages, deleteImages } from "../repositories/moment.repository.js";
import { responseFromCreateMoment, 
    responseFromUpdateMoment, 
    responseFromDeleteMoment,
    responseFromAddImages,
    responseFromDeleteImages } from "../dtos/moment.dto.js";


export const momentCreate = async (data) => {
    try {
        // 1. draft 상태에서 제목과 내용이 없는 경우 안내 메시지 출력
        if (data.status === "draft" && !data.title && !data.content) {
            console.info("임시저장하시겠습니까? 필요한 경우 제목이나 내용을 나중에 추가할 수 있습니다.");
        }

        // 2. Planner 연결 유효성 검증 (선택적)
        if (data.plannerId) {
        const planner = await prisma.planner.findUnique({
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

export const momentUpdate = async (data) => {
    try {
        const { momentId, plannerId } = data;

        const existingMoment = await prisma.moment.findUnique({
            where: { id: momentId },
            include: { post: true },
        });

        if (!existingMoment) {
            throw new Error("수정하려는 Moment를 찾을 수 없습니다.");
        }

        if (plannerId !== undefined && plannerId !== null) {
            const planner = await prisma.planner.findUnique({
                where: { id: plannerId },
            });
            if (!planner) {
                throw new Error("유효하지 않은 Planner ID입니다.");
            }
        }

        const updatedMoment = await updateMoment(data);

        return responseFromUpdateMoment(updatedMoment);
    } catch (error) {
        console.error("Moment 수정 중 오류 발생:", error.message);
        throw new Error("Moment 수정을 실패했습니다. 다시 시도해주세요.");
    }
};

export const momentDelete = async (data) => {
    try {
        const { userId, momentId } = data;

        const existingMoment = await prisma.moment.findUnique({
            where: { id: momentId },
            include: { post: true },
        });

        if (!existingMoment) {
            throw new Error("삭제하려는 Moment를 찾을 수 없습니다.");
        }

        if (existingMoment.post.userId !== userId) {
            throw new Error("사용자에게 해당 Moment를 삭제할 권한이 없습니다.");
        }

        const deletedMomentId = await deleteMoment(momentId);

        return responseFromDeleteMoment(deletedMomentId);
    } catch (error) {
        console.error("Moment 삭제 중 오류 발생:", error.message);
        throw new Error("Moment 삭제에 실패했습니다. 다시 시도해주세요.");
    }
};


export const addImagesToMoment = async (userId, momentId, images) => {
    try {
        // Moment 권한 검증
        const moment = await prisma.moment.findUnique({
            where: { id: momentId },
            include: { post: true },
        });
        if (!moment) throw new Error("Moment가 존재하지 않습니다.");
        if (moment.post.userId !== userId) throw new Error("권한이 없습니다.");

        // 이미지 추가 처리
        const addedImages = await addImages(momentId, images);

        // 추가된 이미지 다시 조회
        const updatedImages = await prisma.momentContent.findMany({
            where: { momentId },
            orderBy: { sortOrder: "asc" },
        });

        // 응답 데이터 생성 및 반환
        return responseFromAddImages(momentId, updatedImages);
    } catch (error) {
        console.error("사진 추가 중 오류 발생:", error.message);
        throw new Error("사진 추가에 실패했습니다. 다시 시도해주세요.");
    }
};

export const deleteImageFromMoment = async (userId, momentId, imageId) => {
    try {
        // Moment 권한 검증
        const moment = await prisma.moment.findUnique({
            where: { id: momentId },
            include: { post: true },
        });
        if (!moment) throw new Error("Moment가 존재하지 않습니다.");
        if (moment.post.userId !== userId) throw new Error("권한이 없습니다.");

        // 이미지 삭제 처리
        const deletedMomentId = await deleteImages(imageId, momentId);

        // 남아 있는 이미지 다시 조회
        const remainingImages = await prisma.momentContent.findMany({
            where: { momentId },
            orderBy: { sortOrder: "asc" },
        });

        // 응답 데이터 생성 및 반환
        return responseFromDeleteImages(momentId, remainingImages);
    } catch (error) {
        console.error("사진 삭제 중 오류 발생:", error.message);
        throw new Error("사진 삭제에 실패했습니다. 다시 시도해주세요.");
    }
};





