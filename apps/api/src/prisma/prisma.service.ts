import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@repo/db";
import { OnModuleInit } from "@nestjs/common";
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    console.log("Nice ! Prisma connected !");
  }
}
