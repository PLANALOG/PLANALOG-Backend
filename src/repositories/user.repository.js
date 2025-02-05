
import { prisma } from '../db.config.js'
import { DeletedUserError } from '../errors.js';

export const getUserByNickname = async (nickname) => {

    const user = await prisma.user.findFirst({ where: { nickname } });

    return user
}

export const updateUserProfile = async (data, userId) => {
    await isDeletedUser(userId);

    const user = await prisma.user.update({
        data,
        where: { id: userId }
    })

    return user;
}

export const getMyProfile = async (userId) => {
    await isDeletedUser(userId);

    const user = await prisma.user.findFirst({
        where: { id: userId }
    });

    return user;
}

export const getUserProfile = async (userId) => {
    await isDeletedUser(userId);

    const user = await prisma.user.findFirst({
        select: {
            id: true,
            nickname: true,
            type: true,
            introduction: true,
            link: true,
            profileImage: true
        },
        where: { id: userId }
    });

    return user;
}


export const deleteUser = async (userId) => {
    const user = await prisma.user.update({
        data: {
            isDeleted: true,
            deletedAt: new Date()
        },
        where: { id: userId }
    })


    return user;
}

export const isDeletedUser = async (userId) => {
    const user = await prisma.user.findFirst({
        where: { id: userId }
    })

    if (!user) {
        console.log('유저가 존재하지 않습니다.');
        return null;
    }

    const deletedDate = new Date(user.deletedAt);
    const now = new Date();

    const leftDays = 14 - (now.getDate() - deletedDate.getDate());
    // 14 - (오늘 - 탈퇴일 )

    if (user.isDeleted) throw new DeletedUserError({ leftDays });

}