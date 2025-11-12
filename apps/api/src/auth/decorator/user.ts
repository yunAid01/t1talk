import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { AuthenticatedUser } from "@repo/types";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return {
      id: user.id,
      nickname: user.nickname,
    };
  }
);
