import { prisma } from '../db.config.js'

export const getUserByNickname = async (nickname) => {

    const user = await prisma.user.findFirst({ where: { nickname } });

    return user
}

export const updateUserProfile = async (data) => {
    const user = await prisma.user.update({
        data,
        where: { id: data.userId }
    })

    return user
}