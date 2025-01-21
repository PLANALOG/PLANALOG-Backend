import { prisma } from "../db.config.js";

//createMoment
//updateMoment
//deleteMoment
//addImagesToMoment
//deleteImagesFromMoment
//reorderMomentImages


export const createMoment = async (data) => {
    return await prisma.$transaction(async (prisma) => {
        // Post 생성
        const createPost = await prisma.post.create({
            data: {
                userId: data.userId,
                title: data.title,
                postType: "moment", // ENUM 값 (moment or story)
                status: data.status, // ENUM 값 (public or draft)
                textAlign: data.textAlign, // ENUM 값 (left, center, right)
            },
        });

        // Moment 생성
        const createMoment = await prisma.moment.create({
            data: {
                postId: createPost.id,
                content: data.content,
            },
        });

        // 이미지 데이터 삽입
        if (data.images?.length > 0) {
            const contents = data.images.map(image => ({
                momentId: createMoment.id,
                url: image.url,
                sortOrder: image.sortOrder,
            }));
            await prisma.momentContent.createMany({ data: contents });
        }

        return createMoment.id;
    });
};


export const updateMoment = async (data) => {
    return await prisma.$transaction(async (prisma) => {
        const { momentId, title, content, status, plannerId, textAlign } = data;

        const updatedPost = await prisma.post.update({
            where: { id: (await prisma.moment.findUnique({ where: { id: momentId } })).postId },
            data: {
                ...(title !== undefined && { title }),
                ...(status && { status }),
                ...(textAlign && { textAlign }),
            },
        });

        const updatedMoment = await prisma.moment.update({
            where: { id: momentId },
            data: {
                ...(content !== undefined && { content }),
                ...(plannerId === null && { plannerId: null }),
                ...(plannerId !== undefined && plannerId !== null && { plannerId }),
            },
        });

        return {
            postId: updatedPost.id,
            momentId: updatedMoment.id,
            title: updatedPost.title,
            content: updatedMoment.content,
            status: updatedPost.status,
            textAlign: updatedPost.textAlign,
            plannerId: updatedMoment.plannerId,
            updatedAt: updatedMoment.updatedAt,
        };
    });
};

export const deleteMoment = async (momentId) => {
    return await prisma.$transaction(async (prisma) => {
        // Moment 삭제
        const momentToDelete = await prisma.moment.findUnique({
            where: { id: momentId },
            include: { post: true },
        });

        if (!momentToDelete) {
            throw new Error("삭제하려는 Moment를 찾을 수 없습니다.");
        }

        await prisma.momentContent.deleteMany({
            where: { momentId },
        });

        await prisma.moment.delete({
            where: { id: momentId },
        });

        await prisma.post.delete({
            where: { id: momentToDelete.post.id },
        });

        return momentId;
    });
};