import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PrismaModule } from "../prisma/prisma.module";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChatController, MessageController],
  providers: [ChatGateway, ChatService, MessageService],
})
export class ChatModule {}
