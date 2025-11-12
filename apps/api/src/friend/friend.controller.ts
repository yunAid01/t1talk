import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/decorator/user';
import type { AuthenticatedUser } from '@repo/types';

// zod & dtos
import { ZodResponse } from 'nestjs-zod';
import {
  MyFriendsResponseDto,
  NotMyFriendsResponseDto,
  CreateFriendResponseDto,
  FriendDetailsResponseDto,
} from './dto/response-friends.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ZodResponse({ type: CreateFriendResponseDto })
  @Post(':id')
  createFriend(@User() user: AuthenticatedUser, @Param('id') friendId: string) {
    const userId = user.id;
    return this.friendService.createFriend(userId, +friendId);
  }

  @ZodResponse({ type: MyFriendsResponseDto })
  @Get('my')
  findMyFriends(@User() user: AuthenticatedUser) {
    const userId = user.id;
    return this.friendService.findFriends(userId);
  }

  @ZodResponse({ type: NotMyFriendsResponseDto })
  @Get('not-my')
  findNotMyFriends(@User() user: AuthenticatedUser) {
    const userId = user.id;
    return this.friendService.findNotMyFriends(userId);
  }

  @ZodResponse({ type: FriendDetailsResponseDto })
  @Get(':id')
  findFriendDetails(
    @User() user: AuthenticatedUser,
    @Param('id') otherId: string,
  ) {
    const userId = user.id;
    return this.friendService.findFriendDetails(userId, +otherId);
  }

  @Delete(':id')
  deleteFriend(@User() user: AuthenticatedUser, @Param('id') id: string) {
    const myId = user.id;
    return this.friendService.deleteFriend(myId, +id);
  }
}
