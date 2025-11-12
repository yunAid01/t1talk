import { createZodDto } from 'nestjs-zod';
import {
  CreateMessageInputSchema,
  DeleteMessageResponseSchema,
  MessageListResponseSchema,
  MessageSchema,
} from '@repo/validation';

export class CreateMessageRequestDto extends createZodDto(
  CreateMessageInputSchema,
) {}
export class CreateMessageResponseDto extends createZodDto(MessageSchema) {}
export class DeleteMessageResponseDto extends createZodDto(
  DeleteMessageResponseSchema,
) {}
export class MessageListResponseDto extends createZodDto(
  MessageListResponseSchema,
) {}
