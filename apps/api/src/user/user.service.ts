import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  getUserProfileResponseType,
  updateUserInputType,
  updateUserResponseType,
} from '@repo/validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findMyProfile(myId: number): Promise<getUserProfileResponseType> {
    const myProfile = await this.prisma.user.findUnique({
      where: { id: myId },
    });
    if (!myProfile) {
      throw new NotFoundException('/User not found');
    }
    const { password, ...result } = myProfile;
    return result;
  }

  async updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    return { message: 'Password updated successfully' };
  }

  async updatePrivacy(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isPrivate: !user.isPrivate,
      },
    });
    return {
      message: 'Privacy setting updated successfully',
      isPrivate: updatedUser.isPrivate,
    };
  }

  async updateNotificationOn(
    userId: number,
    type: 'message' | 'friendRequest' | 'groupInvitation',
  ) {
    const fieldMap = {
      message: 'isMessageNotificationOn',
      friendRequest: 'isFriendNotificationOn',
      groupInvitation: 'isGroupInvitationNotificationOn',
    };

    const field = fieldMap[type];
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        [field]: !user[field],
      },
    });
    return {
      type: type,
      message: 'Notification setting updated successfully',
      [field]: updatedUser[field],
    };
  }

  async updateMyProfile(
    userId: number,
    updateData: Partial<updateUserInputType>,
  ): Promise<updateUserResponseType> {
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined),
    );

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: filteredData,
    });
    return {
      message: 'User profile updated successfully',
      updatedData: {
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
        backgroundImageUrl: updatedUser.backgroundImageUrl,
        statusMessage: updatedUser.statusMessage,
      },
    };
  }

  async deleteMyAccount(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User account deleted successfully' };
  }
}
