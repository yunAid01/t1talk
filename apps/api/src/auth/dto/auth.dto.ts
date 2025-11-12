import {
  userCreateSchema,
  userBasicSchema,
  userLoginSchema,
  userLoginResponseSchema,
} from '@repo/validation';
import { createZodDto } from 'nestjs-zod';

// login
export class LoginUserDto extends createZodDto(userLoginSchema) {}
export class LoginResponseDto extends createZodDto(userLoginResponseSchema) {}

// register
export class CreateUserDto extends createZodDto(userCreateSchema) {}
export class CreateUserResponseDto extends createZodDto(userBasicSchema) {}
