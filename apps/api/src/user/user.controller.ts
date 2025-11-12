import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";

@UseGuards(AuthGuard("jwt"))
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  findMyProfile(@Param("id") id: string) {
    return this.userService.findMyProfile(+id);
  }

  /** 유저정보 수정 */
  @Patch(":id")
  updateMyProfile(@Param("id") id: string, @Body() updateUserDto) {
    return this.userService.updateMyProfile(+id, updateUserDto);
  }

  /** 회원가입 탈퇴 */
  @Delete(":id")
  deleteMyAccount(@Param("id") id: string) {
    return this.userService.deleteMyAccount(+id);
  }
}
