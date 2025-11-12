import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodResponse } from 'nestjs-zod';

// DTO
import {
  CreateUserDto,
  CreateUserResponseDto,
  LoginResponseDto,
  LoginUserDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodResponse({ type: CreateUserResponseDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @ZodResponse({ type: LoginResponseDto })
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.loginUser(loginDto);
  }

  // todo -- delete User
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
