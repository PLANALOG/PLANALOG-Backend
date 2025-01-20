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






