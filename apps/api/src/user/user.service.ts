import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findMyProfile(id: number) {
    return `This action returns a #${id} user`;
  }

  updateMyProfile(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  deleteMyAccount(id: number) {
    return `This action removes a #${id} user`;
  }
}
