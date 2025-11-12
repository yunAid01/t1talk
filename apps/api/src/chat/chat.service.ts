import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  ChatRoomCreateRequestType,
  ChatRoomResponseType,
  GroupChatRoomCreateRequestType,
  ChatRoomsListResponseType,
} from '@repo/validation';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly chatRoomsInclude = {
    users: {
      where: {
        leftAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profileImageUrl: true,
            statusMessage: true,
          },
        },
      },
    },
  };

  /** create 1:1 chat room */
  async createChatRoom(
    myId: number,
    friend: ChatRoomCreateRequestType,
  ): Promise<ChatRoomResponseType> {
    try {
      const existingRoom = await this.prisma.chatRoom.findFirst({
        where: {
          isGroup: false,
          users: {
            every: {
              userId: {
                in: [myId, friend.friendId],
              },
            },
          },
        },
      });
      if (existingRoom) {
        return {
          success: true,
          message: 'Existing chat room found.',
        };
      }
      await this.prisma.chatRoom.create({
        data: {
          isGroup: false,
          users: {
            create: [{ userId: myId }, { userId: friend.friendId }],
          },
        },
        include: this.chatRoomsInclude,
      });
      return {
        success: true,
        message: 'new chat room create',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `create chatroom error : ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /** create group chat room */
  async createGroupChatRoom(
    myId: number,
    data: GroupChatRoomCreateRequestType,
  ): Promise<ChatRoomResponseType> {
    try {
      await this.prisma.chatRoom.create({
        data: {
          isGroup: true,
          name: data.name || `Group Chat ${Date.now().toString().slice(-7)}`,
          users: {
            create: [
              ...data.friendIds.map((id) => ({ userId: id })),
              { userId: myId },
            ],
          },
        },
      });
      return {
        success: true,
        message: 'new group chat room created',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `create group chatroom error : ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /** find my chat room lists */
  async findMyChatRooms(userId: number): Promise<ChatRoomsListResponseType> {
    const chatRooms = await this.prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            userId: userId,
            leftAt: null, // 현재 참여중인 채팅방만
          },
        },
      },
      include: {
        ...this.chatRoomsInclude, // users
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // 안읽은 메시지 수 계산 추가
    const chatRoomsWithLastMessage = await Promise.all(
      chatRooms.map(async (room) => {
        const unreadCount = await this.prisma.message.count({
          where: {
            chatRoomId: room.id,
            senderId: { not: userId }, // 내가 보낸 메시지 제외
            readReceipts: {
              none: {
                userId: userId, // 내가 읽지 않은 메시지
              },
            },
          },
        });

        return {
          id: room.id,
          name: room.name,
          isGroup: room.isGroup,
          imageUrl: room.imageUrl,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
          users: room.users,
          lastMessage: room.messages[0]?.isDeleted
            ? '삭제된 메시지'
            : room.messages[0]?.content || null,
          lastMessageAt: room.messages[0]?.createdAt || null,
          unreadCount,
        };
      }),
    );

    return chatRoomsWithLastMessage;
  }

  /** delete chat room */
  async deleteMyChatRoom(myId: number, roomId: number) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        users: true,
      },
    });
    if (!chatRoom) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }
    const isParticipant = chatRoom.users.some(
      (user) => user.userId === myId && user.leftAt === null,
    );
    if (!isParticipant) {
      throw new NotFoundException('채팅방을 찾을 수 없습니다.');
    }
    await this.prisma.chatRoom.delete({
      where: { id: roomId },
    });
    return {
      success: true,
      message: 'chatRoom is successfully deleted.',
    };
  }
}
