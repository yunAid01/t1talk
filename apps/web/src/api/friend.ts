import apiClient from './client';

// types
import {
  MyFriendsResponseType,
  NotMyFriendsResponseType,
} from '@repo/validation';
import { FriendDetailsResponseType } from '@repo/validation';

/** 친구 목록 조회(최초 진입점) */
export const findFriends = async (): Promise<MyFriendsResponseType> => {
  const response: MyFriendsResponseType = await apiClient.get('/friend/my');
  return response;
};

/** 내 친구 아닌 친구 목록 조회 */
export const findNotMyFriends = async (): Promise<NotMyFriendsResponseType> => {
  const response: NotMyFriendsResponseType =
    await apiClient.get('/friend/not-my');
  return response;
};

/** 친추 요청 리스트 보기 */
export interface FriendRequestResponseType {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  statusMessage: string | null;
}
export const findFriendRequests = async (): Promise<
  FriendRequestResponseType[]
> => {
  const response: FriendRequestResponseType[] =
    await apiClient.get('/friend/requests');
  return response;
};

/** 친구추가 요청 보내기 */
export const sendFriendRequest = async (friendId: number) => {
  const response = await apiClient.post(`/friend/${friendId}`);
  return response;
};

/** 친구추가 요청 취소하기 */
export const deleteFriendRequest = async (friendId: number) => {
  const response = await apiClient.delete(`/friend/request/${friendId}`);
  return response;
};

/** 친구추가 요청 인정 */
export const acceptFriendRequest = async (friendId: number) => {
  const response = await apiClient.post(`/friend/${friendId}/accept`);
  return response;
};

/** 친구추가 요청 거절 */
export const rejectFriendRequest = async (friendId: number) => {
  const response = await apiClient.post(`/friend/${friendId}/reject`);
  return response;
};

/** 친구추가하기 */
export const createFriend = async (friendId: number) => {
  const response = await apiClient.post(`/friend/${friendId}`);
  return response;
};

/** 친구 삭제 */
export const deleteFriend = async (friendId: number) => {
  const response = await apiClient.delete(`/friend/${friendId}`);
  return response;
};

export interface NotMyFriendDetailsResponseType {
  hasSentFriendRequest: boolean;
  hasReceivedFriendRequest: boolean;
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  statusMessage: string | null;
  isPrivate: boolean;
}

/** 내 친구 아닌 친구 상세 보기 */
export const getNotMyFriendDetails = async (
  userId: number,
): Promise<NotMyFriendDetailsResponseType> => {
  const response: NotMyFriendDetailsResponseType = await apiClient.get(
    `/friend/not-my/${userId}`,
  );
  return response;
};

/** 내 친구 상세 보기 */
export const getFriendDetails = async (
  friendId: number,
): Promise<FriendDetailsResponseType> => {
  const response: FriendDetailsResponseType = await apiClient.get(
    `/friend/${friendId}`,
  );
  return response;
};

export interface FavoriteResponseType {
  message: string;
  isFavorite: boolean;
}
/** create favorite */
export const createFriendFavorite = async (
  friendId: number,
): Promise<FavoriteResponseType> => {
  const response: FavoriteResponseType = await apiClient.patch(
    `/friend/${friendId}/favorite`,
  );
  return response;
};
/** delete favorite */
export const deleteFriendFavorite = async (
  friendId: number,
): Promise<FavoriteResponseType> => {
  const response: FavoriteResponseType = await apiClient.patch(
    `/friend/${friendId}/favorite`,
  );
  return response;
};

/** create block */
export const createFriendBlock = async (friendId: number) => {
  const response = await apiClient.patch(`/friend/${friendId}/block`);
  return response;
};

/** delete block */
export const deleteFriendBlock = async (friendId: number) => {
  const response = await apiClient.patch(`/friend/${friendId}/block`);
  return response;
};
