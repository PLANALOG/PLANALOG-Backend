import { DuplicateUserNicknameError, NoExistsUserError } from "../errors.js";
import { getUserByNickname, updateUserProfile, getMyProfile, getUserProfile, deleteUser } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";
import { kakaoDisconnect } from "../auth.config.js";


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


export const userDelete = async (userId, refreshToken) => {
    const user = await deleteUser(userId);

    console.log('DB에서 유저 삭제 성공', user, refreshToken);

    if (user.platform === "kakao") {
        await kakaoDisconnect(userId, refreshToken);
    }
    //카카오 연결끊기 완료
    //구글 및 네이버 연결끊기 구현 
    // 세션 없애기 
    //### DB에서 30일 뒤 사용자 삭제하는 스케줄러 설정 
    // ### user정보 조회/수정하는 모든 로직에서 isDeleted 고려하도록 수정 



    return user;

}