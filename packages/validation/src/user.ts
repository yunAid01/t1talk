import { z } from 'zod';

export const getUserProfileResponseSchema = z.object({
  email: z.string(),
  nickname: z.string(),
  statusMessage: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  backgroundImageUrl: z.string().nullable(),
  createdAt: z.date(),
  isMessageNotificationOn: z.boolean(),
  isFriendNotificationOn: z.boolean(),
  isGroupInvitationNotificationOn: z.boolean(),
  isPrivate: z.boolean(),
});

export const updateUserInputSchema = z.object({
  nickname: z.string().min(2).max(10).nullable().optional(),
  email: z.string().email().nullable().optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  backgroundImageUrl: z.string().url().nullable().optional(),
  statusMessage: z.string().max(15).nullable().optional(),
});

export const updateUserResponseSchema = z.object({
  message: z.string(),
  updatedData: updateUserInputSchema,
});

/** type message | groupInvitation | friendRequest */
export const notificationSchema = z.enum([
  'message',
  'friendRequest',
  'groupInvitation',
]);
export const NotificationUpdateResponseSchema = z.object({
  message: z.string(),
  isMessageNotificationOn: z.boolean().optional(),
  isFriendNotificationOn: z.boolean().optional(),
  isGroupInvitationNotificationOn: z.boolean().optional(),
});

/** update privacy */
export const PrivacyUpdateResponseSchema = z.object({
  message: z.string(),
  isPrivate: z.boolean(),
});

export type updateUserInputType = z.infer<typeof updateUserInputSchema>;
export type getUserProfileResponseType = z.infer<
  typeof getUserProfileResponseSchema
>;
export type updateUserResponseType = z.infer<typeof updateUserResponseSchema>;
export type NotificationUpdateResponseType = z.infer<
  typeof NotificationUpdateResponseSchema
>;
export type NotificationType = z.infer<typeof notificationSchema>;
export type PrivacyUpdateResponseType = z.infer<
  typeof PrivacyUpdateResponseSchema
>;
