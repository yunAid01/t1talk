import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// types
import {
  MyFriendsResponseType,
  NotMyFriendsResponseType,
  CreateFriendResponseType,
} from '@repo/validation';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  // todo - 친구 추가
  async createFriend(
    userId: number,
    friendId: number,
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
        { isFavorite: 'desc' }, // 즐겨찾기가 먼저
        { createdAt: 'desc' }, // 최근 추가 순
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

  /** 특정 인물 자세히보기 */
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
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
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
    return { message: 'Friend deleted successfully.' };
  }

  /** 친구 즐겨찾기 토글 */
  async toggleFavorite(userId: number, friendId: number): Promise<any> {
    const friend = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });
    if (!friend) {
      throw new NotFoundException('Friend relationship not found.');
    }
    try {
      if (friend?.isFavorite === true) {
        await this.prisma.friend.update({
          where: {
            userId_friendId: { userId, friendId },
          },
          data: {
            isFavorite: false,
          },
        });
        return {
          message: 'Favorite status updated successfully.',
          isFavorite: false,
        };
      } else if (friend?.isFavorite === false) {
        await this.prisma.friend.update({
          where: {
            userId_friendId: { userId, friendId },
          },
          data: {
            isFavorite: true,
          },
        });
        return {
          message: 'Favorite status updated successfully.',
          isFavorite: true,
        };
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      throw new InternalServerErrorException(
        'Failed to toggle favorite status.',
      );
    }
  }

  /** 친구 차단 토글 */
  async toggleBlock(userId: number, friendId: number): Promise<any> {
    const friend = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });
    if (!friend) {
      throw new NotFoundException('Friend relationship not found.');
    }
    try {
      if (friend.isBlocked === true) {
        await this.prisma.friend.update({
          where: {
            userId_friendId: { userId, friendId },
          },
          data: {
            isBlocked: false,
          },
        });
        return {
          message: 'Block status updated successfully.',
          isBlocked: false,
        };
      } else if (friend.isBlocked === false) {
        await this.prisma.friend.update({
          where: {
            userId_friendId: { userId, friendId },
          },
          data: {
            isBlocked: true,
          },
        });
        return {
          message: 'Block status updated successfully.',
          isBlocked: true,
        };
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      throw new InternalServerErrorException('Failed to toggle block status.');
    }
  }
}
