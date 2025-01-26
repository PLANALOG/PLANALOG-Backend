import { addFriendService, getFriendsService } from '../services/friend.service.js';
import { createFriendDto } from '../dtos/friend.dto.js';
import { StatusCodes } from 'http-status-codes'; // HTTP 상태 코드를 활용하기 위해 추가



export const addFriend = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    // 입력값이 올바른지 확인
    if (!fromUserId || !toUserId) {
      throw new Error('fromUserId와 toUserId는 필수 값입니다.');
    }

    const result = await addFriendService(fromUserId, toUserId);
    res.status(201).json({ message: 'Friend added successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// 친구 목록 조회 핸들러
export const getFriends = async (req, res) => {
  try {
    console.log('친구 목록 조회 요청이 들어왔습니다!');
    
    // 쿼리스트링에서 `nickname` 가져오기
    const { nickname } = req.query;

    // params에서 특정 userId 가져오기
    const { userId } = req.params;

    let friends;

    if (nickname) {
      // 닉네임으로 친구 검색
      friends = await prisma.friend.findMany({
        where: {
          fromUserId: Number(userId), // 요청한 사용자의 친구 중에서
          toUser: {
            nickname: {
              contains: nickname, // 닉네임이 포함된 경우
            },
          },
        },
        include: {
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              introduction: true,
              link: true,
              nickname: true,
            },
          },
        },
      });
    } else {
      // 특정 친구 정보 가져오기
      friends = await prisma.friend.findMany({
        where: {
          fromUserId: Number(userId), // 요청한 사용자의 친구 목록
        },
        include: {
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              introduction: true,
              link: true,
              nickname: true,
            },
          },
        },
      });
    }

    // 결과 가공
    const formattedFriends = friends.map((friend) => ({
      id: friend.toUser.id,
      name: friend.toUser.name,
      email: friend.toUser.email,
      introduction: friend.toUser.introduction,
      link: friend.toUser.link,
      nickname: friend.toUser.nickname,
    }));

    // 성공 응답
    res.status(StatusCodes.OK).json({
      message: '친구 목록 조회 성공',
      data: formattedFriends,
    });
  } catch (error) {
    console.error('친구 목록 조회 중 에러:', error.message);

    // 실패 응답
    res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};
