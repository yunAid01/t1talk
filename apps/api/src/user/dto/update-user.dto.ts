import {
  updateUserInputSchema,
  updateUserResponseSchema,
  getUserProfileResponseSchema,
} from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

// input
export class updateUserDto extends createZodDto(updateUserInputSchema) {}

// output
export class updateUserResponseDto extends createZodDto(
  updateUserResponseSchema,
) {}
export class getUserProfileResponseDto extends createZodDto(
  getUserProfileResponseSchema,
) {}
