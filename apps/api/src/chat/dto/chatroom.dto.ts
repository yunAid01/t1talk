import {
  ChatRoomCreateRequestSchema,
  ChatRoomResponseSchema,
  GroupChatRoomCreateRequestSchema,
  ChatRoomsListResponseSchema,
} from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

export class ChatRoomCreateRequestDto extends createZodDto(
  ChatRoomCreateRequestSchema,
) {}

export class GroupChatRoomCreateRequestDto extends createZodDto(
  GroupChatRoomCreateRequestSchema,
) {}
export class ChatRoomsListResponseDto extends createZodDto(
  ChatRoomsListResponseSchema,
) {}

// ------------------------

export class DeleteChatRoomResponseDto extends createZodDto(
  ChatRoomResponseSchema,
) {}
export class ChatRoomResponseDto extends createZodDto(ChatRoomResponseSchema) {}
