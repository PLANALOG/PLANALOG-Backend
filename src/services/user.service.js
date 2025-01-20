import { DuplicateUserNicknameError, NoExistsUserError } from "../errors.js";
import { getUserByNickname, updateUserProfile, getMyProfile, getUserProfile } from "../repositories/user.repository.js";
import { responseFromUser } from "../dtos/user.dto.js";

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

