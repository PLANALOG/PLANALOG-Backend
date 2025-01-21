//moment 생성 DTO

export const bodyToCreateMoment = (body) => {
    // 유효성 검증
    if (!body.status) {
        throw new Error("저장할 상태를 지정해주세요.");
    }
    // status가 public인 경우: title과 content 필수
    if (body.status === "public") {
        if (!body.title || !body.content) {
            throw new Error("공개(public) 상태에서는 제목(title)과 내용(content)이 있어야 저장이 가능합니다.");
        }
    }

    // 이미지 URL 검증 (공통)
    if (body.images?.some(image => !image.url)) {
        throw new Error("이미지 URL이 올바르지 않습니다.");
    }

     // textAlign 기본값 설정 및 유효성 검증
    const validTextAligns = ["left", "center", "right"];
    const textAlign = validTextAligns.includes(body.textAlign) ? body.textAlign : "left";

    // plannerId 유효성 검증 
    if (body.plannerId && typeof body.plannerId !== "number") {
        throw new Error("Planner ID는 숫자여야 합니다.");
    }


    return {
        title: body.title || null, // title이 없는 경우 null로 설정
        status: body.status,
        textAlign: body.textAlign,
        content: body.content || null, // content가 없는 경우 null로 설정
        images: body.images || [], // 이미지가 없는 경우 빈 배열
        plannerId: body.plannerId || null, // Planner ID를 선택적으로 포함
    };
};


export const responseFromCreateMoment = (moment) => {
    return {
        momentId: moment.id, 
        postId: moment.post.id, 
        status: moment.post.status, 
        title: moment.post.title, 
        content: moment.content, 
        textAlign: moment.post.textAlign,
        images: moment.momentContents.map(image => ({
            url: image.url, 
            sortOrder: image.sortOrder, 
        })), 
        createdAt: moment.createdAt, 
    };
};

//moment 수정 DTO
export const bodyToUpdateMoment = (body) => {
    const { title, content, status, plannerId, textAlign, momentId } = body;
    //유효성 검증
    if (!momentId) {
        throw new Error("수정할 Moment ID가 필요합니다.");
    }

    // status가 public으로 변경될 경우 title과 content가 필요
    if (status === "public" && (!title || !content)) {
        throw new Error("공개(public) 상태로 변경하려면 제목(title)과 내용(content)이 필요합니다.");
    }

    // plannerId 검증 (숫자 또는 null 허용)
    if (plannerId !== undefined && plannerId !== null && typeof plannerId !== "number") {
        throw new Error("Planner ID는 숫자 또는 null이어야 합니다.");
    }

    // textAlign 검증
    if (textAlign && !["left", "center", "right"].includes(textAlign)) {
        throw new Error("textAlign 값은 left, center, right 중 하나여야 합니다.");
    }

    return {
        momentId,
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        status: status || undefined,
        plannerId: plannerId !== undefined ? plannerId : undefined,
        textAlign: textAlign || undefined,
    };
};


export const responseFromUpdateMoment = (moment) => {
    return {
        postId: moment.post.id,
        momentId: moment.id,
        title: moment.post.title,
        content: moment.content,
        status: moment.post.status,
        textAlign: moment.post.textAlign,
        plannerId: moment.plannerId || null,
        updatedAt: moment.updatedAt,
    };
};


//moment 삭제 DTO
export const responseFromDeleteMoment = (momentId) => {
    return {
        momentId,
    };
};


//사진추가 DTO
export const responseFromAddImages = (momentId, addedImages) => {
    return {
        momentId,
        addedImages: addedImages.map((image) => ({
            id: image.id,
            url: image.url,
            sortOrder: image.sortOrder,
        })),
    };
};

//사진삭제 DTO
export const responseFromDeleteImages = (momentId) => {
    return {
        momentId,
    };
};






