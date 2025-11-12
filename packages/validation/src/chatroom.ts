import { z } from 'zod';
import { MessageSchema } from './index.js';

/** 1:1 채팅방 생성 요청 */
export const ChatRoomCreateRequestSchema = z.object({
  friendId: z.number(),
});

/** 그룹 채팅방 생성 요청 */
export const GroupChatRoomCreateRequestSchema = z.object({
  friendIds: z
    .array(z.number())
    .min(2, '그룹 채팅은 최소 2명 이상이어야 합니다'),
  name: z.string().optional(),
});

/** 채팅방 생성 & 삭제 응답*/
export const ChatRoomResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

/** 채팅방 참여 유저 정보 */
export const ChatRoomUserSchema = z.object({
  id: z.number(),
  userId: z.number(),
  chatRoomId: z.number(),
  isAdmin: z.boolean(),
  joinedAt: z.string().or(z.date()),
  leftAt: z.string().nullable().or(z.date().nullable()),
  notificationOn: z.boolean(),
  user: z.object({
    id: z.number(),
    nickname: z.string(),
    profileImageUrl: z.string().nullable(),
    statusMessage: z.string().nullable(),
  }),
});

/** specific chatroom get and create response */
export const ChatRoomSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  users: z.array(ChatRoomUserSchema),
  messages: z.array(MessageSchema),
});

/** 채팅방 목록용 (마지막 메시지만) */
export const ChatRoomItemSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  isGroup: z.boolean(),
  imageUrl: z.string().nullable(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  users: z.array(ChatRoomUserSchema),
  lastMessage: z.string().nullable(), // 마지막 메시지 내용
  lastMessageAt: z.string().or(z.date()).nullable(), // 마지막 메시지 시간
  unreadCount: z.number(),
});

/** 내 채팅방 목록 응답 (배열) */
export const ChatRoomsListResponseSchema = z.array(ChatRoomItemSchema);

// types
export type ChatRoomCreateRequestType = z.infer<
  typeof ChatRoomCreateRequestSchema
>;
export type GroupChatRoomCreateRequestType = z.infer<
  typeof GroupChatRoomCreateRequestSchema
>;
export type ChatRoomResponseType = z.infer<typeof ChatRoomResponseSchema>;
export type ChatRoomType = z.infer<typeof ChatRoomSchema>; // 하나
export type ChatRoomsListResponseType = z.infer<
  typeof ChatRoomsListResponseSchema
>;
