

export const bodyToUpdateUser = (body) => {
    return {
        nickname: body.nickname || undefined,
        type: body.type || undefined,
        introduction: body.introduction || undefined,
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
        introduction: user.introduction,
        link: user.link,
        profileImage: user.profileImage
    }
}