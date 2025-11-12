import { z } from 'zod';

/** create user request zod schema */
export const userCreateSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  nickname: z.string().min(3, { message: '닉네임은 3글자 이상이어야 합니다.' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 6글자 이상이어야 합니다.' }),
});

/** login user request zod schema */
export const userLoginSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 6글자 이상이어야 합니다.' }),
});

/** user response schema */
export const userBasicSchema = z.object({
  id: z.number(),
  email: z.string().email({ message: '유효한 이메일을 입력해주세요' }),
  nickname: z.string().min(3),
  createdAt: z.string().or(z.date()),
  statusMessage: z.string().nullish(), // string | undefined | null
  profileImage: z.string().nullish(), // string | undefined | null
});

/** login user response zod schema */
export const userLoginResponseSchema = z.object({
  access_token: z.string(),
  user: userBasicSchema,
});

//types
export type UserCreateInputType = z.infer<typeof userCreateSchema>;
export type UserLoginInputType = z.infer<typeof userLoginSchema>;
export type UserCreateResponseType = z.infer<typeof userBasicSchema>;
export type UserLoginResponseType = z.infer<typeof userLoginResponseSchema>;
