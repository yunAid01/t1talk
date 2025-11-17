import {
  updateUserInputSchema,
  updateUserResponseSchema,
  getUserProfileResponseSchema,
  NotificationUpdateResponseSchema,
  PrivacyUpdateResponseSchema,
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
export class NotificationUpdateResponseDto extends createZodDto(
  NotificationUpdateResponseSchema,
) {}
export class PrivacyUpdateResponseDto extends createZodDto(
  PrivacyUpdateResponseSchema,
) {}
