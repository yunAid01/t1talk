import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMessageInputType,
  DeleteMessageResponseType,
  MessageType,
} from '@repo/validation';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

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
    // 1. 채팅방 존재 및 권한 확인
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

    // 2. 메시지 생성
    const message = await this.prisma.message.create({
      data: {
        chatRoomId: data.chatRoomId,
        senderId: userId,
        content: data.content,
      },
      include: this.messageInclude,
    });
    // 3. 채팅방 업데이트 시간 갱신
    await this.prisma.chatRoom.update({
      where: { id: data.chatRoomId },
      data: { updatedAt: new Date() },
    });
    return message;
  }

  /** 메시지 삭제 (소프트 삭제) */
  async deleteMessage(
    userId: number,
    messageId: number,
  ): Promise<DeleteMessageResponseType> {
    // 1. 메시지 존재 확인
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('메시지를 찾을 수 없습니다.');
    }

    // 2. 본인이 보낸 메시지인지 확인
    if (message.senderId !== userId) {
      throw new ForbiddenException('본인이 보낸 메시지만 삭제할 수 있습니다.');
    }

    // 3. 소프트 삭제
    await this.prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });

    return {
      success: true,
      message: '메시지가 삭제되었습니다.',
    };
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
    // 이미 읽음 처리되었는지 확인
    const existingReceipt = await this.prisma.readReceipt.findUnique({
      where: {
        messageId_userId: {
          messageId: messageId,
          userId: userId,
        },
      },
    });
    if (existingReceipt) {
      return existingReceipt; // 이미 읽음 처리된 경우 반환
    }
    return await this.prisma.readReceipt.create({
      data: {
        messageId: messageId,
        userId: userId,
      },
    });
  }
}
