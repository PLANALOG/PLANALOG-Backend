

export const bodyToUpdateUser = (body) => {
    return {
        nickname: body.nickname || undefined,
        type: body.type || undefined,
        inrtoduction: body.inrtoduction || undefined,
        link: body.link || undefined
    }
}

export const responseFromUser = (user) => {
    return {
        userId: user.id,
        email: user.email,
        platform: user.platform,
        name: user.name,
        nickname: user.nickname,
        type: user.type,
        inrtoduction: user.introduction,
        link: user.link
    }
}