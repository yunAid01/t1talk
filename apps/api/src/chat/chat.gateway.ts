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
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

//types
import type {
  JoinRoomEventType,
  TypingStartEventType,
  TypingStopEventType,
} from '@repo/validation';
import Redis from 'ioredis';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // 1. JWT 토큰 추출
      const token =
        client.handshake.auth.token ||
        client.handshake.headers['authorization']?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Unauthorized connection attempt: ${client.id}`);
        client.disconnect();
        return;
      }

      // 2. JWT 검증
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload || !payload.sub) {
        this.logger.warn(`Invalid token for client: ${client.id}`);
        client.disconnect();
        return;
      }

      // 3. 클라이언트 데이터 저장
      client.data.userId = payload.sub;
      client.data.email = payload.email;

      const userSocketKey = `user:sockets:${client.data.userId}`;

      // 본인방 생성
      const personalRoom = `user_${client.data.userId}`;
      await client.join(personalRoom);
      this.logger.log(`User joined personal room: ${personalRoom}`);

      // 4. Redis에 소켓 정보 저장
      await this.redisClient.sadd(userSocketKey, client.id);
      await this.redisClient.expire(userSocketKey, 86400); // 24시간 TTL

      // 5. 온라인 상태 처리
      const socketCount = await this.redisClient.scard(userSocketKey);
      if (socketCount === 1) {
        // 첫 번째 소켓 연결 = 온라인 상태로 전환
        await this.redisClient.sadd('online_users', client.data.userId);
        const onlineCount = await this.redisClient.scard('online_users');
        this.logger.log(
          `✅ User ${client.data.userId} is now ONLINE (socket: ${client.id}, total online: ${onlineCount})`,
        );

        // 모든 클라이언트에게 온라인 알림
        this.server.emit('user_online', { userId: client.data.userId });
      } else {
        this.logger.log(
          `🔗 Additional connection for User ${client.data.userId} (socket: ${client.id}, total: ${socketCount})`,
        );
      }

      // 6. 접속한 클라이언트에게 현재 온라인 유저 목록 전송
      const onlineUserIds = await this.redisClient.smembers('online_users');
      client.emit('online_users', onlineUserIds.map(Number));
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
  // chat.gateway.ts

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId;

    if (!userId) {
      this.logger.warn(`Disconnecting unauthenticated socket: ${client.id}`);
      return;
    }

    const userSocketKey = `user:sockets:${userId}`;

    try {
      // 1. Redis에서 해당 소켓 제거
      await this.redisClient.srem(userSocketKey, client.id);

      // 2. 남은 소켓 개수 확인
      const remainingSockets = await this.redisClient.scard(userSocketKey);

      if (remainingSockets === 0) {
        // 3. 모든 연결이 끊김 = 오프라인 상태로 전환
        await this.redisClient.srem('online_users', userId);
        await this.redisClient.del(userSocketKey); // 키 제거

        this.logger.log(
          `❌ User ${userId} is now OFFLINE (socket: ${client.id})`,
        );

        // 모든 클라이언트에게 오프라인 알림
        this.server.emit('user_offline', { userId });
      } else {
        this.logger.log(
          `🔌 User ${userId} disconnected one device (socket: ${client.id}, remaining: ${remainingSockets})`,
        );
      }
    } catch (error) {
      this.logger.error(
        `❌ Disconnect error for socket ${client.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /** 채팅방 입장 */
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() data: JoinRoomEventType,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { chatRoomId } = data;
      const roomName = `chat_${chatRoomId}`;

      await client.join(roomName);
      this.logger.log(`📥 User ${client.data.userId} joined room: ${roomName}`);

      // 채팅방 내 사용자들에게 입장 알림
      client.to(roomName).emit('user_joined', {
        userId: client.data.userId,
        chatRoomId,
      });
    } catch (error) {
      this.logger.error(
        `❌ Join room error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /** 채팅방 퇴장 */
  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @MessageBody() data: JoinRoomEventType,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { chatRoomId } = data;
      const roomName = `chat_${chatRoomId}`;

      await client.leave(roomName);
      this.logger.log(`📤 User ${client.data.userId} left room: ${roomName}`);

      // 채팅방에 퇴장 알림
      client.to(roomName).emit('user_left', {
        userId: client.data.userId,
        chatRoomId,
      });
    } catch (error) {
      this.logger.error(
        `❌ Leave room error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /** 타이핑 시작 */
  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: TypingStartEventType,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomName = `chat_${data.chatRoomId}`;

      // 본인 제외하고 브로드캐스트
      client.to(roomName).emit('user_typing', {
        userId: data.userId,
        nickname: data.nickname,
        chatRoomId: data.chatRoomId,
      });
    } catch (error) {
      this.logger.error(
        `❌ Typing start error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /** 타이핑 종료 */
  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @MessageBody() data: TypingStopEventType,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const roomName = `chat_${data.chatRoomId}`;

      client.to(roomName).emit('user_stop_typing', {
        userId: data.userId,
        chatRoomId: data.chatRoomId,
      });
    } catch (error) {
      this.logger.error(
        `❌ Typing stop error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
