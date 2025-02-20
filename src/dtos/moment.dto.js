// YYYY-MM-DD 형식으로 변환하는 함수 (UTC+9 적용)
const formatDate = (date) => {
    if (!date) return null;
    const validDate = date instanceof Date ? date : new Date(date); // 문자열이면 Date 객체로 변환
    if (isNaN(validDate.getTime())) {
        console.error("Invalid date detected:", date);
        return null;
    }
    const KST = new Date(validDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용
    return KST.toISOString().split("T")[0]; // YYYY-MM-DD
};

// YYYY-MM-DDTHH:mm:ss.sssZ 형식으로 변환하는 함수 (UTC+9 적용)
const formatDateTime = (date) => {
    if (!date) return null;
    const validDate = date instanceof Date ? date : new Date(date); // 문자열이면 Date 객체로 변환
    if (isNaN(validDate.getTime())) {
        console.error("Invalid date detected:", date);
        return null;
    }
    const KST = new Date(validDate.getTime() + 9 * 60 * 60 * 1000); // UTC+9 적용
    return KST.toISOString(); // ISO 형식 유지
};

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


export const responseFromCreateMoment = (moment) => {
    return {
        id: moment.id,
        userId: moment.userId,
        title: moment.title,
        date: formatDate(moment.createdAt),  // YYYY-MM-DD 형식의 새로운 필드 추가
        plannerId: moment.plannerId ?? null,
        createdAt: formatDateTime(moment.createdAt), 
        updatedAt: formatDateTime(moment.updatedAt), 
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
        createdAt: formatDateTime(moment.createdAt), 
        updatedAt: formatDateTime(moment.updatedAt), 
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

    return moments
        //  map() 실행 전에 undefined 또는 id 없는 객체 제거
        .filter(moment => {
            const isValid = moment && moment.id !== undefined;
            return isValid;
        })
        .map(moment => {
            try {
                const firstContent = moment.momentContents?.length > 0 ? moment.momentContents[0].url : null;

                return {
                    momentId: typeof moment.id === 'bigint' ? BigInt(moment.id) : moment.id,
                    title: moment.title,
                    date: formatDate(moment.createdAt), 
                    userName: moment.user?.name ?? "알 수 없음",
                    likingCount: moment.likingCount ?? 0,
                    commentCount: moment._count?.comments ?? 0,
                    thumbnailURL: firstContent
                };
            } catch (error) {
                console.error("DTO 변환 중 오류 발생:", error, moment);
                return null;
            }
        })
        //  map() 실행 후 변환 오류로 인해 null이 된 데이터 제거
        .filter(moment => {
            return moment !== null;
        });
};


// 나의 Moment 상세 조회 DTO
export const responseFromMyMomentDetail = (moment) => {
    return {
        userId: moment.userId,
        momentId: moment.id,
        title: moment.title,
        date: formatDate(moment.createdAt),
        plannerId: moment.plannerId ?? null,
        createdAt: formatDateTime(moment.createdAt), 
        updatedAt: formatDateTime(moment.updatedAt), 
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null
        }))
    };
};


export const responseFromOtherUserMoments = (moments) => {
    if (!Array.isArray(moments)) {
        console.error("❌ moments가 배열이 아님:", moments);
        return [];
    }

    return moments.map(moment => {
        if (!moment || typeof moment.id === "undefined") {
            console.error("❌ moment.id가 유실됨! 원인 추적 필요:", moment);
            return null;
        }

        const transformedMoment = {
            userId: Number(moment.userId),  // ✅ bigint 변환
            momentId: Number(moment.id),    // ✅ bigint 변환
            title: moment.title,
            date: moment.createdAt ? moment.createdAt.toISOString().split("T")[0] : "날짜 없음",
            userName: moment.user?.name ?? "알 수 없음",
            likingCount: Number(moment.likingCount ?? 0),
            commentCount: Number(moment._count?.comments ?? 0),
            thumbnailURL: moment.momentContents?.length > 0 ? moment.momentContents[0].url : null
        };

        return transformedMoment;
    }).filter(moment => moment !== null);
};





// 친구의 Moment 상세 조회 DTO
export const responseFromOtherUserMomentDetail = (moment) => {
    if (!moment || !moment.id) {
        console.error("잘못된 moment 데이터:", moment);
        return null;
    }

    return {
        userId: moment.userId,
        momentId: moment.id,
        title: moment.title,
        date: formatDate(moment.createdAt),
        plannerId: moment.plannerId ?? null,
        createdAt: formatDateTime(moment.createdAt),
        updatedAt: formatDateTime(moment.updatedAt),
        momentContents: moment.momentContents.map(content => ({
            sortOrder: content.sortOrder,
            content: content.content,
            url: content.url ?? null
        }))
    };
};
