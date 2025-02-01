//  moment 생성 DTO
export const bodyToCreateMoment = (body) => {
    // 유효성 검증: status 필수
    if (!body.status) {
        throw new Error("저장할 상태를 지정해주세요.");
    }

    // momentContents 배열 확인
    const momentContents = Array.isArray(body.momentContents) ? body.momentContents : [];

    // status가 public인 경우: title + momentContents 필수
    if (body.status === "public") {
        if (!body.title) {
            throw new Error("공개(public) 상태에서는 제목(title)이 필수입니다.");
        }
        if (momentContents.length === 0) {
            throw new Error("공개(public) 상태에서는 최소 하나 이상의 페이지가 필요합니다.");
        }
        // 모든 페이지에 content 필수
        if (momentContents.some(momentContent => !momentContent.content)) {
            throw new Error("공개(public) 상태에서는 모든 페이지에 content 값이 포함되어야 합니다.");
        }
    }

    // momentContents의 sortOrder 중복 검사
    const sortOrders = momentContents.map(content => content.sortOrder);
    const hasDuplicateOrders = new Set(sortOrders).size !== sortOrders.length;
    if (hasDuplicateOrders) {
        throw new Error("momentContents 내부의 sortOrder 값이 중복되었습니다.");
    }

    return {
        title: body.title || null,
        status: body.status,
        plannerId: body.plannerId || null,
        momentContents: momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content ?? null, // draft에서는 null 가능
            url: content.url || null // 이미지 URL이 없으면 null
        }))
    };
};

//  moment 생성 응답 DTO
export const responseFromCreateMoment = (moment) => {
    return {
        id: moment.id,
        userId: moment.userId,
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

//  moment 수정 DTO
export const bodyToUpdateMoment = (body) => {
    // 유효성 검증: status 필수
    if (!body.status) {
        throw new Error("저장할 상태를 지정해주세요.");
    }

    // momentContents 배열 확인
    const momentContents = Array.isArray(body.momentContents) ? body.momentContents : [];
    const deletedSortOrders = Array.isArray(body.deletedSortOrders) ? body.deletedSortOrders : [];

    // status가 public인 경우: title + momentContents 필수
    if (body.status === "public") {
        if (!body.title) {
            throw new Error("공개(public) 상태에서는 제목(title)이 필수입니다.");
        }
        if (momentContents.length === 0 && deletedSortOrders.length === 0) {
            throw new Error("공개(public) 상태에서는 최소 하나 이상의 페이지가 필요합니다.");
        }
        if (momentContents.some(momentContent => !momentContent.content)) {
            throw new Error("공개(public) 상태에서는 모든 페이지에 content 값이 포함되어야 합니다.");
        }
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
        title: body.title || null,
        status: body.status,
        momentContents: momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content ?? null,
            url: content.url || null,
            insertAfterId: content.insertAfterId || null, // 추가된 부분
        })),
        deletedSortOrders: deletedSortOrders, // ✅ 삭제할 페이지 정보 추가
    };
};

//  moment 수정 응답 DTO
export const responseFromUpdateMoment = (moment) => {
    return {
        id: moment.id,
        userId: moment.userId,
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



// 나의 Moment 목록 조회 DTO
export const responseFromMyMoments = (moments) => {
    return moments.map(moment => ({
        momentId: moment.id,
        title: moment.title,
        status: moment.status,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        thumbnailUrl: moment.momentContents[0]?.url || null // 첫 페이지 이미지를 썸네일로 사용
    }));
};

// 나의 Moment 상세 조회 DTO
export const responseFromMyMomentDetail = (moment) => {
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