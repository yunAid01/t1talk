import { z } from 'zod';

// ============================================================================
// FRIEND - 기본 스키마
// ============================================================================

/** 유저 기본 정보 스키마 */
export const UserBasicSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().nullable(),
  backgroundImageUrl: z.string().nullable(),
  statusMessage: z.string().nullable(),
});

/** 유저 상세 정보 스키마 (이메일 포함) */
export const UserDetailSchema = UserBasicSchema.extend({
  email: z.string(),
});

// ============================================================================
// FRIEND - 친구 추가
// ============================================================================

/** 친구 추가 요청 (URL Param으로 전달) */
export const CreateFriendParamSchema = z.object({
  friendId: z.number(),
});

/** 친구 추가 응답 */
export const CreateFriendResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  friendId: z.number(),
  isFavorite: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  friend: UserBasicSchema,
});

// ============================================================================
// FRIEND - 내 친구 목록 조회
// ============================================================================

/** 내 친구 목록 응답 (단일 친구) */
export const MyFriendItemSchema = z.object({
  id: z.number(),
  userId: z.number(),
  friendId: z.number(),
  isFavorite: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  friend: UserBasicSchema,
});

/** 내 친구 목록 응답 (배열) */
export const MyFriendsResponseSchema = z.array(MyFriendItemSchema);

// ============================================================================
// FRIEND - 친구가 아닌 유저 목록 조회
// ============================================================================

/** 친구가 아닌 유저 목록 응답 */
export const NotMyFriendsResponseSchema = z.array(UserBasicSchema);

// ============================================================================
// FRIEND - 특정 유저 상세 정보 조회
// ============================================================================

/** 친구 상세 정보 응답 */
export const FriendDetailsResponseSchema = UserBasicSchema.extend({
  isFriend: z.boolean(),
  isFavorite: z.boolean(),
  isBlocked: z.boolean(),
});

// ============================================================================
// Type Exports
// ============================================================================

export type UserBasicType = z.infer<typeof UserBasicSchema>;
export type UserDetailType = z.infer<typeof UserDetailSchema>;

export type CreateFriendParamType = z.infer<typeof CreateFriendParamSchema>;
export type CreateFriendResponseType = z.infer<
  typeof CreateFriendResponseSchema
>;

export type MyFriendItemType = z.infer<typeof MyFriendItemSchema>;
export type MyFriendsResponseType = z.infer<typeof MyFriendsResponseSchema>;

export type NotMyFriendsResponseType = z.infer<
  typeof NotMyFriendsResponseSchema
>;

export type FriendDetailsResponseType = z.infer<
  typeof FriendDetailsResponseSchema
>;
