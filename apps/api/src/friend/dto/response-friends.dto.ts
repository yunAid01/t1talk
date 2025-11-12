import { createZodDto } from "nestjs-zod";
import {
  CreateFriendResponseSchema,
  FriendDetailsResponseSchema,
  MyFriendsResponseSchema,
  NotMyFriendsResponseSchema,
} from "@repo/validation";

/** 내 친구 찾기 응답 DTO */
export class MyFriendsResponseDto extends createZodDto(MyFriendsResponseSchema) {}

/** 내 친구 아닌 친구 응답 DTO */
export class NotMyFriendsResponseDto extends createZodDto(NotMyFriendsResponseSchema) {}

/** 친구 추가 응답 DTO */
export class CreateFriendResponseDto extends createZodDto(CreateFriendResponseSchema) {}

/** 특정 친구 자세히 보기 응답 DTO */
export class FriendDetailsResponseDto extends createZodDto(
  FriendDetailsResponseSchema
) {}
