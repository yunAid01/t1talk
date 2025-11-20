import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMessageInputType,
  DeleteMessageResponseType,
  MessageType,
} from '@repo/validation';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatGateway: ChatGateway,
  ) {}

  private readonly messageInclude = {
    sender: {
      select: {
        id: true,
        nickname: true,
        profileImageUrl: true,
      },
    },
    readReceipts: {
      select: {
        userId: true,
        readAt: true,
      },
    },
  };

  /** 메시지 생성 */
  async createMessage(
    userId: number,
    data: CreateMessageInputType,
  ): Promise<MessageType> {
    try {
      const chatRoomUser = await this.prisma.chatRoomUser.findFirst({
        where: {
          chatRoomId: data.chatRoomId,
          userId: userId,
          leftAt: null, // 현재 참여중인 유저만
        },
      });
      if (!chatRoomUser) {
        throw new ForbiddenException('채팅방에 접근 권한이 없습니다.');
      }
      const message = await this.prisma.message.create({
        data: {
          chatRoomId: data.chatRoomId,
          senderId: userId,
          content: data.content,
        },
        include: this.messageInclude,
      });
      await this.prisma.chatRoom.update({
        where: { id: data.chatRoomId },
        data: { updatedAt: new Date() },
      });
      this.chatGateway.server
        .to(`chat_${data.chatRoomId}`)
        .emit('new_message', message);
      const friends = await this.prisma.friend.findMany({
        where: {
          userId: userId,
        },
      });
      friends.map((friend) =>
        this.chatGateway.server
          .to(`user_${friend.friendId}`)
          .emit('message_notification', message),
      );

      return message;
    } catch (error) {
      throw new InternalServerErrorException(
        '메시지 생성 중 오류가 발생했습니다.',
      );
    }
  }

  /** 메시지 삭제 (소프트 삭제) */
  async deleteMessage(
    userId: number,
    messageId: number,
  ): Promise<DeleteMessageResponseType> {
    try {
      // 1. 메시지 존재 확인
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        throw new NotFoundException('메시지를 찾을 수 없습니다.');
      }

      // 2. 본인이 보낸 메시지인지 확인
      if (message.senderId !== userId) {
        throw new ForbiddenException(
          '본인이 보낸 메시지만 삭제할 수 있습니다.',
        );
      }

      // 3. 소프트 삭제
      const deletedMessage = await this.prisma.message.update({
        where: { id: messageId },
        data: { isDeleted: true, updatedAt: new Date() },
      });
      this.chatGateway.server
        .to(`chat_${deletedMessage.chatRoomId}`)
        .emit('message_deleted', {
          messageId: deletedMessage.id,
          chatRoomId: deletedMessage.chatRoomId,
        });
      return {
        success: true,
        message: '메시지가 삭제되었습니다.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '메시지 삭제 중 오류가 발생했습니다.',
      );
    }
  }

  /** 채팅방의 메시지 목록 조회 */
  async getChatRoomMessages(
    userId: number,
    chatRoomId: number,
  ): Promise<MessageType[]> {
    // 1. 채팅방 접근 권한 확인
    const chatRoomUser = await this.prisma.chatRoomUser.findFirst({
      where: {
        chatRoomId: chatRoomId,
        userId: userId,
      },
    });

    if (!chatRoomUser) {
      throw new ForbiddenException('채팅방에 접근 권한이 없습니다.');
    }

    // 2. 메시지 목록 조회 (최신순)
    const messages = await this.prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      include: this.messageInclude,
      orderBy: {
        createdAt: 'asc', // 오래된 순서
      },
    });
    return messages;
  }

  /** 메시지 읽음 처리 */
  async markAsRead(userId: number, messageId: number) {
    try {
      // 1. 메시지 정보 조회 (chatRoomId 필요)
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
        select: { chatRoomId: true, senderId: true },
      });

      if (!message) {
        throw new NotFoundException('메시지를 찾을 수 없습니다.');
      }

      // 2. 자기 자신의 메시지는 읽음 처리 안함
      if (message.senderId === userId) {
        return null;
      }

      // 3. upsert로 중복 생성 방지 (있으면 업데이트, 없으면 생성)
      const readReceipt = await this.prisma.readReceipt.upsert({
        where: {
          messageId_userId: {
            messageId: messageId,
            userId: userId,
          },
        },
        update: {}, // 이미 있으면 아무것도 안함
        create: {
          messageId: messageId,
          userId: userId,
        },
      });

      // 4. DB 저장 성공 후 WebSocket으로 해당 채팅방에만 브로드캐스트
      this.chatGateway.server
        .to(`chat_${message.chatRoomId}`)
        .emit('message_read', {
          messageId: messageId,
          userId: userId,
          readAt: readReceipt.readAt,
        });

      return readReceipt;
    } catch (error: any) {
      // Prisma 유니크 제약 조건 에러는 무시 (이미 읽음 처리됨)
      if (error.code === 'P2002') {
        console.log(
          `Message ${messageId} already marked as read by user ${userId}`,
        );
        return null;
      }
      throw new InternalServerErrorException(
        '메시지 읽음 처리 중 오류가 발생했습니다.',
      );
    }
  }
}
