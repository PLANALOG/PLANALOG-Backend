import { DuplicateUserNicknameError, NoExistsUserError } from "../errors.js";
import { getUserByNickname, updateUserProfile, getMyProfile, getUserProfile, deleteUser } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { kakaoDisconnect, googleDisconnect, naverDisconnect } from "../auth.config.js";
import { deleteFile } from "../multer.js";
import { prisma } from "../db.config.js"


export const userEdit = async (data, userId) => {
    // 존재하는 닉네임인지 확인 후 boolean값 반환 
    const nicknameUser = await getUserByNickname(data.nickname);
    // 존재하는 닉네임이면 에러 반환
    if (nicknameUser) throw new DuplicateUserNicknameError(data.nickname);

    // 유저 정보 수정 
    const editedUser = await updateUserProfile(data, userId);

    return responseFromUser(editedUser);

}

export const nicknameCheck = async (nickname) => {

    const nicknameUser = await getUserByNickname(nickname);

    if (nicknameUser) return true;
    else return false;

}

export const myProfile = async (userId) => {

    const user = await getMyProfile(userId);

    if (!user) throw new NoExistsUserError(userId)

    return responseFromUser(user)
}


export const userProfile = async (userId) => {

    const user = await getUserProfile(userId);

    if (!user) throw new NoExistsUserError(userId)

    return responseFromUser(user)
}


export const userDelete = async (userId, user) => {
    const isUserExist = await getMyProfile(userId);
    if (!isUserExist) throw new NoExistsUserError(userId);

    // 유저의 서버 자체 리프레시 토큰 삭제 
    await prisma.refreshToken.deleteMany({
        where: { userId: userId }
    });
    console.log('리프레시 토큰 삭제 완료');


    // DB에서 유저 삭제 
    const deletedUser = await deleteUser(userId);
    console.log('DB에서 유저 삭제 성공');

    //탈퇴하는 유저의 socialRefreshToken 가져오기 (연결끊기 요청을 위해)
    const socialRefreshToken = deletedUser.socialRefreshToken;
    console.log('탈퇴하는 유저의 소셜리프레시토큰 : ', socialRefreshToken)
    if (!socialRefreshToken) {
        console.error('유저의 소셜리프레시토큰이 존재하지 않습니다');
    };

    try {
        if (deletedUser.platform === "kakao") {
            await kakaoDisconnect(userId, socialRefreshToken);
        }
        else if (deletedUser.platform === "google") {
            await googleDisconnect(userId, socialRefreshToken);
        }
        else if (deletedUser.platform === "naver") {
            await naverDisconnect(userId, socialRefreshToken);
        }

    } catch (error) {
        throw new Error(`소셜 연결 끊기 실패 : (${error})`);
    }
    return deletedUser;
}


export const profileImageEdit = async (imagePaths, userId) => {

    //기존 프로필 이미지 url 가져오기
    const user = await getMyProfile(userId);
    const deleteImageUrl = user.profileImage;
    console.log('deleteImageUrl', deleteImageUrl);

    if (deleteImageUrl) {
        // URL에서 경로만 추출 (폴더 확인을 위해)
        const parsedUrl = new URL(deleteImageUrl);
        const imagePath = parsedUrl.pathname.startsWith('/') ? parsedUrl.pathname.substring(1) : parsedUrl.pathname;
        console.log('Extracted imagePath:', imagePath);

        // 기존 프로필 이미지 삭제 (기본 이미지가 아닐 때만)
        if (!imagePath.startsWith('basic_images/')) {
            try {
                await deleteFile(deleteImageUrl);
            } catch (err) {
                console.error("Error deleting file:", err);
            }
        }
    }

    //프로필 이미지 경로 업데이트 
    const updatedUser = await updateUserProfile({ profileImage: imagePaths }, userId);

    //업데이트된 프로필 이미지 url 반환
    return responseFromUser({ profileImage: updatedUser.profileImage });
}