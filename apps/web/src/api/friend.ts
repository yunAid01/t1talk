import apiClient from "./client";

// types
import {
  MyFriendsResponseType,
  NotMyFriendsResponseType,
} from "@repo/validation";
import { FriendDetailsResponseType } from "@repo/validation";

/** 친구 목록 조회(최초 진입점) */
export const findFriends = async (): Promise<MyFriendsResponseType> => {
  const response: MyFriendsResponseType = await apiClient.get("/friend/my");
  return response;
};

/** 내 친구 아닌 친구 목록 조회 */
export const findNotMyFriends = async (): Promise<NotMyFriendsResponseType> => {
  const response: NotMyFriendsResponseType =
    await apiClient.get("/friend/not-my");
  return response;
};

// todo - 친구 추가 -> 잘 작동했음
export const createFriend = async (friendId: number) => {
  const response = await apiClient.post(`/friend/${friendId}`);
  return response;
};

/** 친구 삭제 */
export const deleteFriend = async (friendId: number) => {
  const response = await apiClient.delete(`/friend/${friendId}`);
  return response;
};

export const getFriendDetails = async (
  friendId: number
): Promise<FriendDetailsResponseType> => {
  const response: FriendDetailsResponseType = await apiClient.get(
    `/friend/${friendId}`
  );
  return response;
};
