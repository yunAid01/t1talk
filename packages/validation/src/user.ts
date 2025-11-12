import { z } from 'zod';

export const updateUserInputSchema = z.object({
  nickname: z.string().min(2).max(10).optional(),
  profileImageUrl: z.string().url().nullable().optional(),
  statusMessage: z.string().max(15).nullable().optional(),
});
export type updateUserInputType = z.infer<typeof updateUserInputSchema>;
