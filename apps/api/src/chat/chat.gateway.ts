import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtService } from '@nestjs/jwt';

//types
import type {
  CreateMessageInputType,
  JoinRoomEventType,
  TypingStartEventType,
  TypingStopEventType,
} from '@repo/validation';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('ChatGateway');

  // 온라인 사용자 추적 (userId -> Set<socketId>)
  private onlineUsers: Map<number, Set<string>> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) {
        this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload || !payload.sub) {
        this.logger.warn(`Invalid token for client: ${client.id}`);
        client.disconnect();
        return;
      }
      client.data.userId = payload.sub;
      client.data.email = payload.email;

      // 온라인 사용자 목록에 추가
      if (!this.onlineUsers.has(client.data.userId)) {
        this.onlineUsers.set(client.data.userId, new Set());
      }
      this.onlineUsers.get(client.data.userId)!.add(client.id);

      // 현재 온라인인 모든 사용자 ID 목록 전송
      const onlineUserIds = Array.from(this.onlineUsers.keys());
      client.emit('online_users', onlineUserIds);

      this.logger.log(
        `Client connected: ${client.id}, User ID: ${client.data.userId}, Online users: ${onlineUserIds.length}`,
      );
    } catch (error) {
      this.logger.error(
        error instanceof Error
          ? `Connection error: ${error.message}`
          : 'Unknown error',
      );
      client.disconnect();
    }
  }

  /** 클라이언트 연결 해제 시 */
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (userId && this.onlineUsers.has(userId)) {
      const userSockets = this.onlineUsers.get(userId)!;
      userSockets.delete(client.id);

      // 해당 사용자의 모든 소켓이 끊어졌으면 오프라인 처리
      if (userSockets.size === 0) {
        this.onlineUsers.delete(userId);
        // 모든 클라이언트에게 사용자 오프라인 알림
        this.server.emit('user_offline', { userId });
        this.logger.log(`User ${userId} is now offline`);
      }
    }

    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** 채팅방 입장 */
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomEventType,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;
    const roomName = `chat_${chatRoomId}`;

    await client.join(roomName);
    this.logger.log(`User ${client.data.userId} joined room: ${roomName}`);

    // 채팅방에 입장 알림 (사용자가 온라인 상태로 변경됨)
    this.server.emit('user_online', { userId: client.data.userId });

    // 채팅방 내 사용자들에게 입장 알림
    client.to(roomName).emit('user_joined', {
      userId: client.data.userId,
      chatRoomId,
    });
  }

  /** 채팅방 퇴장 */
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: JoinRoomEventType,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId } = data;
    const roomName = `chat_${chatRoomId}`;

    await client.leave(roomName);
    this.logger.log(`User ${client.data.userId} left room: ${roomName}`);

    // 채팅방에 퇴장 알림
    client.to(roomName).emit('user_left', {
      userId: client.data.userId,
      chatRoomId,
    });
  }

  /** 타이핑 시작 */
  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: TypingStartEventType,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `chat_${data.chatRoomId}`;

    // 본인 제외하고 브로드캐스트
    client.to(roomName).emit('user_typing', {
      userId: data.userId,
      nickname: data.nickname,
      chatRoomId: data.chatRoomId,
    });
  }

  /** 타이핑 종료 */
  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @MessageBody() data: TypingStopEventType,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `chat_${data.chatRoomId}`;

    client.to(roomName).emit('user_stop_typing', {
      userId: data.userId,
      chatRoomId: data.chatRoomId,
    });
  }
}
