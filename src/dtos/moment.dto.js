import dayjs from "dayjs";

export const bodyToCreateMoment = (body) => {
    if (!body) {
        throw new Error("요청 body값이 없습니다."); // body값이 없는 경우
    }

    if (!Array.isArray(body.momentContents)) {
        throw new Error("momentContents는 배열이어야 합니다.");
    }

    const momentContents = body.momentContents;


    // 🔹 title 유효성 검사 강화
    if (!body.title || typeof body.title !== "string") {
        throw new Error("제목을 문자열로 작성해주세요.");
    }
    if (momentContents.length === 0) {
        throw new Error("최소 하나의 페이지가 존재해야합니다.");
    }
    if (momentContents.some(content => content.content === undefined || content.content === null || content.content.trim() === '')) {
        throw new Error("모든 페이지에 빈 내용이 포함될 수 없습니다.");
    }

    const sortOrders = momentContents.map(content => content.sortOrder);
    if (new Set(sortOrders).size !== sortOrders.length) {
        throw new Error("sortOrder 값은 중복될 수 없습니다.");
    }
    

    return {
        title: body.title,
        plannerId: body.plannerId ?? null, // plannerId가 없으면 null 처리
        momentContents: momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null
        }))
    };
};


//  moment 생성 응답 DTO
export const responseFromCreateMoment = (moment) => {
    return {
        id: moment.id,
        userId: moment.userId,
        title: moment.title,
        date: dayjs(moment.date).format("YYYY-MM-DD"),
        plannerId: moment.plannerId ?? null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null,
        }))
    };
};


//  moment 수정 DTO
export const bodyToUpdateMoment = (body) => {

    // 🔹 title 유효성 검사 강화
    if (!body.title || typeof body.title !== "string") {
        throw new Error("제목을 문자열로 작성해주세요.");
    }

    // momentContents 배열 확인
    const momentContents = Array.isArray(body.momentContents) ? body.momentContents : [];
    const deletedSortOrders = Array.isArray(body.deletedSortOrders) ? body.deletedSortOrders : [];

    if (momentContents.some(content => content.content === undefined || content.content === null || content.content.trim() === '')) {
        throw new Error("모든 페이지에 빈 내용이 포함될 수 없습니다.");
    }

    // momentContents 내부의 sortOrder 중복 검사 (null 제외)
    const sortOrders = momentContents
        .filter(content => content.sortOrder !== null)
        .map(content => content.sortOrder);

    const hasDuplicateOrders = new Set(sortOrders).size !== sortOrders.length;
    if (hasDuplicateOrders) {
        throw new Error("momentContents 내부의 sortOrder 값이 중복되었습니다.");
    }

    return {
        title: body.title,
        plannerId: body.plannerId ?? null,
        momentContents: momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null,
            insertAfterSortOrder: content.insertAfterSortOrder || null, // 추가된 부분
        })),
        deletedSortOrders: deletedSortOrders, // 삭제할 페이지 정보 추가
    };
};

//  moment 수정 응답 DTO
export const responseFromUpdateMoment = (moment) => {
    return {
        id: moment.id,
        userId: moment.userId,
        title: moment.title,
        plannerId: moment.plannerId || null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url,
        }))
    };
};


export const responseFromMyMoments = (moments) => {
    if (!Array.isArray(moments)) {
        console.error("moments가 배열이 아님:", moments);
        return [];
    }

    return moments.map(moment => {
        try {
            const firstContent = moment.momentContents?.length > 0 ? moment.momentContents[0].url : null; // 🔥 thumbnailURL 보장

            return {
                momentId: typeof moment.id === 'bigint' ? Number(moment.id) : moment.id,
                title: moment.title,
                userName: moment.user?.name ?? "알 수 없음",
                date: dayjs(moment.date).format("YYYY-MM-DD"),
                likingCount: moment.likingCount ?? 0,
                commentCount: moment._count?.comments ?? 0,
                thumbnailURL: firstContent
            };
        } catch (error) {
            console.error("DTO 변환 중 오류 발생:", error, moment);
            return null;
        }
    }).filter(moment => moment !== null);
};







// 나의 Moment 상세 조회 DTO
export const responseFromMyMomentDetail = (moment) => {
    return {
        userId: moment.userId,
        momentId: moment.id,
        title: moment.title,
        date: dayjs(moment.date).format("YYYY-MM-DD"),
        plannerId: moment.plannerId ?? null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null
        }))
    };
};


//  친구의 Moment 목록 조회 DTO
export const responseFromFriendsMoments = (moments) => {
    return moments.map(moment => ({
        userId: moment.userId,
        momentId: moment.id,
        title: moment.title,
        status: moment.status,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        thumbnailUrl: moment.momentContents[0]?.url || null
    }));
};

// 친구의 moment 상세 조회 DTO
export const responseFromFriendMomentDetail = (moment) => {
    return {
        userId: moment.userId,
        momentId: moment.id,
        title: moment.title,
        status: moment.status,
        plannerId: moment.plannerId || null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url,
        }))
    };
}; 