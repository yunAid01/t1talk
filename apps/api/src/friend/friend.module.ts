import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ChatModule } from '@/chat/chat.module';

@Module({
  imports: [PrismaModule, ChatModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
