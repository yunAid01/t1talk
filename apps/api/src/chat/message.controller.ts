import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from './message.service';
import { User } from '../auth/decorator/user';
import type { AuthenticatedUser } from '@repo/types';
import {
  CreateMessageRequestDto,
  CreateMessageResponseDto,
  DeleteMessageResponseDto,
  MessageListResponseDto,
} from './dto/message.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

@ApiTags('Messages')
@UseGuards(AuthGuard('jwt'))
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ZodResponse({ type: CreateMessageResponseDto })
  createMessage(
    @User() user: AuthenticatedUser,
    @Body() dto: CreateMessageRequestDto,
  ) {
    return this.messageService.createMessage(user.id, dto);
  }

  @Delete(':messageId')
  @ApiOperation({ summary: 'Delete a message' })
  @ZodResponse({ type: DeleteMessageResponseDto })
  deleteMessage(
    @User() user: AuthenticatedUser,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.messageService.deleteMessage(user.id, messageId);
  }

  @Post(':messageId/read')
  @ApiOperation({ summary: 'Mark message as read' })
  markAsRead(
    @User() user: AuthenticatedUser,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    const userId = user.id;
    return this.messageService.markAsRead(userId, messageId);
  }

  @Get('room/:chatRoomId')
  @ApiOperation({ summary: 'Get messages in a chat room' })
  @ZodResponse({ type: MessageListResponseDto })
  getChatRoomMessages(
    @User() user: AuthenticatedUser,
    @Param('chatRoomId', ParseIntPipe) chatRoomId: number,
  ) {
    return this.messageService.getChatRoomMessages(user.id, chatRoomId);
  }
}
