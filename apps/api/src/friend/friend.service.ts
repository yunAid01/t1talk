import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// types
import {
  MyFriendsResponseType,
  NotMyFriendsResponseType,
  CreateFriendResponseType,
} from "@repo/validation";

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  // todo - 친구 추가
  async createFriend(
    userId: number,
    friendId: number
  ): Promise<CreateFriendResponseType> {
    const friend = await this.prisma.friend.create({
      data: {
        userId: userId,
        friendId: friendId,
      },
      include: {
        friend: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
            backgroundImageUrl: true,
            statusMessage: true,
          },
        },
      },
    });

    return friend;
  }

  /** 내친구 찾기 */
  async findFriends(userId: number): Promise<MyFriendsResponseType> {
    const friends = await this.prisma.friend.findMany({
      where: { userId: userId },
      include: {
        friend: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
            backgroundImageUrl: true,
            statusMessage: true,
          },
        },
      },
      orderBy: [
        { isFavorite: "desc" }, // 즐겨찾기가 먼저
        { createdAt: "desc" }, // 최근 추가 순
      ],
    });
    return friends;
  }

  /** 내 친구가 아닌 친구 찾기 */
  async findNotMyFriends(userId: number): Promise<NotMyFriendsResponseType> {
    const myFriends = await this.prisma.friend.findMany({
      where: { userId: userId },
      select: { friendId: true },
    });
    const myFriendIds = myFriends.map((f) => f.friendId);
    const notMyFriends = await this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } }, // 나 자신 제외
          { id: { notIn: myFriendIds } }, // 이미 친구인 사람 제외
        ],
      },
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        backgroundImageUrl: true,
        statusMessage: true,
      },
    });
    return notMyFriends;
  }

  /** 특정 친구 자세히보기 */
  async findFriendDetails(userId: number, friendId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: friendId },
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        backgroundImageUrl: true,
        statusMessage: true,
      },
    });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    const friendRelation = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });

    return {
      ...user,
      isFriend: !!friendRelation, // 친구 여부
      isFavorite: friendRelation ? friendRelation.isFavorite : false,
      isBlocked: friendRelation ? friendRelation.isBlocked : false,
    };
  }

  /** 친구 삭제 */
  async deleteFriend(myId: number, friendId: number) {
    await this.prisma.friend.delete({
      where: {
        userId_friendId: {
          userId: myId,
          friendId: friendId,
        },
      },
    });
    return { message: "Friend deleted successfully." };
  }
}
