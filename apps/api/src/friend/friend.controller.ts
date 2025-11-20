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
  FriendDetailsResponseDto,
} from './dto/response-friends.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post(':id')
  sendFriendRequest(
    @User() user: AuthenticatedUser,
    @Param('id') friendId: string,
  ) {
    const userId = user.id;
    return this.friendService.sendFriendRequest(userId, +friendId);
  }

  @Delete('request/:id')
  deleteFriendRequest(
    @User() user: AuthenticatedUser,
    @Param('id') friendId: string,
  ) {
    const userId = user.id;
    return this.friendService.deleteFriendRequest(userId, +friendId);
  }

  @Post(':id/accept')
  acceptFriendRequest(
    @User() user: AuthenticatedUser,
    @Param('id') friendId: string,
  ) {
    const userId = user.id;
    return this.friendService.acceptFriendRequest(userId, +friendId);
  }

  @Post(':id/reject')
  rejectFriendRequest(
    @User() user: AuthenticatedUser,
    @Param('id') friendId: string,
  ) {
    const userId = user.id;
    return this.friendService.rejectFriendRequest(userId, +friendId);
  }

  @Patch(':id/favorite')
  toggleFavorite(
    @User() user: AuthenticatedUser,
    @Param('id') friendId: string,
  ) {
    const userId = user.id;
    return this.friendService.toggleFavorite(userId, +friendId);
  }

  @Patch(':id/block')
  toggleBlock(@User() user: AuthenticatedUser, @Param('id') friendId: string) {
    const userId = user.id;
    return this.friendService.toggleBlock(userId, +friendId);
  }

  @Get('requests')
  findFriendRequests(@User() user: AuthenticatedUser) {
    const userId = user.id;
    return this.friendService.findFriendRequests(userId);
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

  @Get('not-my/:id')
  findNotMyFriendDetails(
    @User() user: AuthenticatedUser,
    @Param('id') otherId: string,
  ) {
    const userId = user.id;
    return this.friendService.findNotMyFriendDetails(userId, +otherId);
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
