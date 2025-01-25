import { DuplicateUserNicknameError, NoExistsUserError } from "../errors.js";
import { getUserByNickname, updateUserProfile, getMyProfile, getUserProfile, deleteUser } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { kakaoDisconnect, googleDisconnect, naverDisconnect } from "../auth.config.js";
import { deleteFile } from "../multer.js";


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

    const deletedUser = await deleteUser(userId);


    console.log('DB에서 유저 삭제 성공');


    if (deletedUser.platform === "kakao") {

        const refreshToken = user.refreshToken;
        await kakaoDisconnect(userId, refreshToken);
    }
    else if (deletedUser.platform === "google") {

        const accessToken = user.accessToken
        console.log('accessToken', accessToken)
        await googleDisconnect(userId, accessToken);
    }
    else if (deletedUser.platform === "naver") {
        const refreshToken = user.refreshToken;
        await naverDisconnect(userId, refreshToken);
    }


    // 세션 없애기 
    //### DB에서 30일 뒤 사용자 삭제하는 스케줄러 설정 
    // ### user정보 조회/수정하는 모든 로직에서 isDeleted 고려하도록 수정 



    return deletedUser;

}


export const profileImageEdit = async (imagePaths, userId, isBasicImage) => {

    //기존 프로필 이미지 url 가져오기
    const user = await getMyProfile(userId);
    const deleteImageUrl = user.profileImage;
    console.log('deleteImageUrl', deleteImageUrl);

    //기존 프로필 이미지 삭제하기 
    if (!isBasicImage)
        await deleteFile(deleteImageUrl);

    //프로필 이미지 경로 업데이트 
    const updatedUser = await updateUserProfile({ profileImage: imagePaths }, userId);

    //업데이트된 프로필 이미지 url 반환
    return responseFromUser({ profileImage: updatedUser.profileImage });
}