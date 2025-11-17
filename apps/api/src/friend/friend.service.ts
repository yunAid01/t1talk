import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// types
import {
  MyFriendsResponseType,
  NotMyFriendsResponseType,
} from '@repo/validation';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async findFriendRequests(userId: number) {
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
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
    return friendRequests.map((request) => ({
      id: request.sender.id,
      nickname: request.sender.nickname,
      profileImageUrl: request.sender.profileImageUrl,
      backgroundImageUrl: request.sender.backgroundImageUrl,
      statusMessage: request.sender.statusMessage,
    }));
  }

  async sendFriendRequest(userId: number, friendId: number) {
    const friend = await this.prisma.friend.findUnique({
      where: {
        userId_friendId: { userId, friendId },
      },
    });
    if (friend) {
      throw new BadRequestException('이미 친구 관계입니다.');
    }
    const existingRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: friendId,
      },
    });
    if (existingRequest) {
      throw new BadRequestException('이미 친구 요청을 보냈습니다.');
    }
    const newFriendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: friendId,
      },
    });
    return newFriendRequest;
  }

  /** 친구추가 요청 취소하기 */
  async deleteFriendRequest(userId: number, friendId: number) {
    const existingRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: friendId,
        },
      },
    });
    if (!existingRequest) {
      throw new NotFoundException('Friend request not found.');
    }
    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: friendId,
        },
      },
    });
    return {
      message: 'Friend request deleted successfully.',
    };
  }

  // todo - 친구 추가
  async acceptFriendRequest(userId: number, friendId: number) {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.friendRequest.delete({
        where: {
          senderId_receiverId: {
            senderId: friendId,
            receiverId: userId,
          },
        },
      });
      await transaction.friend.createMany({
        data: [
          {
            // 양방향 친구관계
            userId: userId,
            friendId: friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      });
    });
  }

  async rejectFriendRequest(userId: number, friendId: number) {
    await this.prisma.friendRequest.delete({
      where: {
        senderId_receiverId: {
          senderId: friendId,
          receiverId: userId,
        },
      },
    });
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

  /** 내 친구가 아닌 친구 리스트 찾기 */
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

  /** 내 친구 아닌 친구 상세 보기 */
  async findNotMyFriendDetails(userId: number, otherId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: otherId },
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
        backgroundImageUrl: true,
        statusMessage: true,
        isPrivate: true,
      },
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    const existingMyFriendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId: otherId,
        },
      },
    });
    const existingOtherFriendRequest =
      await this.prisma.friendRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: otherId,
            receiverId: userId,
          },
        },
      });
    return {
      ...user,
      hasSentFriendRequest: !!existingMyFriendRequest,
      hasReceivedFriendRequest: !!existingOtherFriendRequest,
    };
  }

  /** 내 친구 자세히보기 */
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
