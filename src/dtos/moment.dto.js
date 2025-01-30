// moment 생성 DTO
// moment 수정 DTO

export const bodyToCreateMoment = (body) => {
    
    // 유효성 검증: status 필수
    if (!body.status) {
        throw new Error("저장할 상태를 지정해주세요.");
    }

    // momentContents가 배열인지 확인하고 기본값 설정
    const momentContents = Array.isArray(body.momentContents) ? body.momentContents : [];

    // status가 public인 경우: title + momentContents 필수
    if (body.status === "public") {
        if (!body.title) {
            throw new Error("공개(public) 상태에서는 제목(title)이 필수입니다.");
        }
        if (momentContents.length === 0) {
            throw new Error("공개(public) 상태에서는 최소 하나 이상의 페이지가 필요합니다.");
        }
        // 각 페이지가 content를 포함하고 있어야 함
        if (momentContents.some(momentContent => !momentContent.content)) {
            throw new Error("각 페이지에는 반드시 content 값이 포함되어야 합니다.");
        }
    }

    // 이미지 URL 검증
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (momentContents.some(momentContent => momentContent.url && !urlRegex.test(momentContent.url))) {
        throw new Error("이미지 URL 형식이 잘못되었습니다.");
    }

    // momentContents의 momentContentId 중복 검사
    const momentContentIds = momentContents.map(content => content.momentContentId);
    const hasDuplicateIds = new Set(momentContentIds).size !== momentContentIds.length;
    if (hasDuplicateIds) {
        throw new Error("momentContents 내부의 momentContentId 값이 중복되었습니다.");
    }

    // status가 draft인 경우: momentContents가 없으면 기본값 추가 (content: null)
    const formattedMomentContents = momentContents.length > 0
        ? momentContents.map((momentContent, index) => ({
            momentContentId: momentContent.momentContentId || index + 1, // momentContentId가 없으면 자동 할당
            content: momentContent.content ?? null, // ✅ draft일 경우 content가 없어도 null로 설정
            url: momentContent.url || null // 이미지 URL이 없으면 null로 설정
        }))
        : [{ momentContentId: 1, content: null, url: null }]; // ✅ draft일 경우 기본값 추가

    // plannerId 유효성 검증 
    if (body.plannerId && typeof body.plannerId !== "number") {
        throw new Error("Planner ID는 숫자여야 합니다.");
    }

    return {
        title: body.title || null, // title이 없는 경우 null로 설정
        status: body.status,
        plannerId: body.plannerId || null, // Planner ID를 선택적으로 포함
        momentContents: formattedMomentContents
    };
};


export const responseFromCreateMoment = (moment, plannerId) => {
    return {
        id: moment.id,
        userId: moment.userId,
        title: moment.title,
        status: moment.status,
        plannerId: plannerId || null,
        createdAt: moment.createdAt,
        updatedAt: moment.updatedAt,
        momentContents: moment.momentContents.map(content => ({
            momentContentId: content.momentContentId,
            content: content.content,
            url: content.url,
        })),
    };
};

export const bodyToUpdateMoment = (body) => {
    
    // 유효성 검증: status 필수
    if (!body.status) {
        throw new Error("저장할 상태를 지정해주세요.");
    }

    // momentContents가 배열인지 확인하고 기본값 설정
    const momentContents = Array.isArray(body.momentContents) ? body.momentContents : [];

    // status가 public인 경우: title 필수
    if (body.status === "public" && !body.title) {
        throw new Error("공개(public) 상태에서는 제목(title)이 필수입니다.");
    }

    // momentContents 배열 검증 (수정할 내용이 하나 이상 있어야 함)
    if (momentContents.length === 0) {
        throw new Error("수정할 momentContents 데이터가 최소 하나 이상 필요합니다.");
    }

    // momentContents 내부의 momentContentId 중복 검사
    const momentContentIds = momentContents.map(content => content.momentContentId);
    const hasDuplicateIds = new Set(momentContentIds).size !== momentContentIds.length;
    if (hasDuplicateIds) {
        throw new Error("momentContents 내부의 momentContentId 값이 중복되었습니다.");
    }

    // momentContents 내 content 필수 검증
    if (momentContents.some(momentContent => momentContent.content === undefined)) {
        throw new Error("각 momentContent에는 content 필드가 포함되어야 합니다.");
    }

    return {
        title: body.title || null, // title이 없는 경우 null로 설정
        status: body.status,
        momentContents: momentContents.map(content => ({
            momentContentId: content.momentContentId,
            content: content.content ?? null, // 기존에 없는 값이면 null 처리
        }))
    };
};

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
            momentContentId: content.momentContentId,
            content: content.content,
        })),
    };
};
