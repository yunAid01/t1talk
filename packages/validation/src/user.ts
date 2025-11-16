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

export type updateUserInputType = z.infer<typeof updateUserInputSchema>;
export type getUserProfileResponseType = z.infer<
  typeof getUserProfileResponseSchema
>;
export type updateUserResponseType = z.infer<typeof updateUserResponseSchema>;
