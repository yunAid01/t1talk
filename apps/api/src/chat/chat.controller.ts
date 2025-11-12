import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { User } from '../auth/decorator/user';
import type { AuthenticatedUser } from '@repo/types';
import { ZodResponse } from 'nestjs-zod';

// dtos
import {
  ChatRoomCreateRequestDto,
  ChatRoomsListResponseDto,
  GroupChatRoomCreateRequestDto,
  ChatRoomResponseDto,
} from './dto/chatroom.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /** 1:1 채팅방 생성 */
  @ZodResponse({ type: ChatRoomResponseDto })
  @Post('room')
  createChatRoom(
    @User() user: AuthenticatedUser,
    @Body() friend: ChatRoomCreateRequestDto,
  ) {
    const userId = user.id;
    return this.chatService.createChatRoom(userId, friend);
  }

  /** 그룹 채팅방 생성 */
  @ZodResponse({ type: ChatRoomResponseDto })
  @Post('room/group')
  createGroupChatRoom(
    @User() user: AuthenticatedUser,
    @Body() friends: GroupChatRoomCreateRequestDto,
  ) {
    const userId = user.id;
    return this.chatService.createGroupChatRoom(userId, friends);
  }

  /** 채팅방 삭제 */
  @ZodResponse({ type: ChatRoomResponseDto })
  @Delete('room/:id')
  deleteChatRoom(
    @User() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) chatRoomId: number,
  ) {
    const userId = user.id;
    return this.chatService.deleteMyChatRoom(userId, chatRoomId);
  }

  @ZodResponse({ type: ChatRoomsListResponseDto })
  @Get('rooms')
  findMyChatRooms(@User() user: AuthenticatedUser) {
    const userId = user.id;
    return this.chatService.findMyChatRooms(userId);
  }
}
