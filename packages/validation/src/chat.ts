import { z } from 'zod';

/** 메시지 발신자 정보 */
export const MessageSenderSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
});

/** 읽음 확인 정보 */
export const ReadReceiptSchema = z.object({
  userId: z.number(),
  readAt: z.string().or(z.date()), // ISO string 또는 Date 객체
});

/** 메시지 base of read and create response */
export const MessageSchema = z.object({
  id: z.number(),
  chatRoomId: z.number(),
  senderId: z.number(),
  content: z.string(),
  isDeleted: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  sender: MessageSenderSchema,
  readReceipts: z.array(ReadReceiptSchema),
});
/** 채팅창 메시지들 보기 */
export const MessageListResponseSchema = z.array(MessageSchema);

/** 메시지 생성 요청 */
export const CreateMessageInputSchema = z.object({
  chatRoomId: z.number(),
  content: z.string().min(1, '메시지 내용은 필수입니다'),
});

/** 메시지 삭제 응답 */
export const DeleteMessageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// ============================================================================
// SOCKET - WebSocket 이벤트
// ============================================================================

/** 채팅방 입장 */
export const JoinRoomEventSchema = z.object({
  chatRoomId: z.number(),
});

/** 새 메시지 수신 (WebSocket) */
export const NewMessageEventSchema = MessageSchema;

/** 메시지 삭제 이벤트 (WebSocket) */
export const MessageDeletedEventSchema = z.object({
  messageId: z.number(),
  chatRoomId: z.number(),
});

/** 타이핑 시작 */
export const TypingStartEventSchema = z.object({
  chatRoomId: z.number(),
  userId: z.number(),
  nickname: z.string(),
});

/** 타이핑 종료 */
export const TypingStopEventSchema = z.object({
  chatRoomId: z.number(),
  userId: z.number(),
});

// ============================================================================
// Type Exports
// ============================================================================
// message related types
export type MessageSenderType = z.infer<typeof MessageSenderSchema>;
export type ReadReceiptType = z.infer<typeof ReadReceiptSchema>;
export type MessageType = z.infer<typeof MessageSchema>;
export type MessageListResponseType = z.infer<typeof MessageListResponseSchema>;
export type CreateMessageInputType = z.infer<typeof CreateMessageInputSchema>;
export type DeleteMessageResponseType = z.infer<
  typeof DeleteMessageResponseSchema
>;

// websocket event types
export type JoinRoomEventType = z.infer<typeof JoinRoomEventSchema>;
export type NewMessageEventType = z.infer<typeof NewMessageEventSchema>;
export type MessageDeletedEventType = z.infer<typeof MessageDeletedEventSchema>;
export type TypingStartEventType = z.infer<typeof TypingStartEventSchema>;
export type TypingStopEventType = z.infer<typeof TypingStopEventSchema>;
