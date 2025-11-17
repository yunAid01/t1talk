import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import {
  updateUserDto,
  updateUserResponseDto,
  getUserProfileResponseDto,
  NotificationUpdateResponseDto,
  PrivacyUpdateResponseDto,
} from './dto/update-user.dto';
import { User } from '@/auth/decorator/user';
import type { AuthenticatedUser } from '@repo/types';
import { ZodResponse } from 'nestjs-zod';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 유저정보 수정 */
  @ZodResponse({ type: updateUserResponseDto })
  @Patch()
  updateMyProfile(
    @User() user: AuthenticatedUser,
    @Body() updateData: updateUserDto,
  ) {
    return this.userService.updateMyProfile(user.id, updateData);
  }

  @ZodResponse({ type: NotificationUpdateResponseDto })
  @Patch('notification')
  updateNotificationOn(
    @User() user: AuthenticatedUser,
    @Body() typeData: { type: 'message' | 'friendRequest' | 'groupInvitation' },
  ) {
    return this.userService.updateNotificationOn(user.id, typeData.type);
  }

  @ZodResponse({ type: PrivacyUpdateResponseDto })
  @Patch('privacy')
  updatePrivacy(@User() user: AuthenticatedUser) {
    return this.userService.updatePrivacy(user.id);
  }

  @Patch('password')
  updatePassword(
    @User() user: AuthenticatedUser,
    @Body() passwordData: { currentPassword: string; newPassword: string },
  ) {
    return this.userService.updatePassword(
      user.id,
      passwordData.currentPassword,
      passwordData.newPassword,
    );
  }

  @ZodResponse({ type: getUserProfileResponseDto })
  @Get()
  findMyProfile(@User() user: AuthenticatedUser) {
    return this.userService.findMyProfile(user.id);
  }

  /** 회원가입 탈퇴 */
  @Delete(':id')
  deleteMyAccount(@Param('id') id: string) {
    return this.userService.deleteMyAccount(+id);
  }
}
