import apiClient from "./client";
import {
  CreateMessageInputType,
  MessageType,
  DeleteMessageResponseType,
} from "@repo/validation";

/** 메시지 생성 (HTTP - 백업용) */
export const createMessage = async (
  data: CreateMessageInputType
): Promise<MessageType> => {
  return await apiClient.post("/messages", data);
};

/** 채팅방의 메시지 목록 조회 */
export const getChatRoomMessages = async (
  chatRoomId: number
): Promise<MessageType[]> => {
  return await apiClient.get(`/messages/room/${chatRoomId}`);
};

/** 메시지 삭제 */
export const deleteMessage = async (
  messageId: number
): Promise<DeleteMessageResponseType> => {
  return await apiClient.delete(`/messages/${messageId}`);
};

/** 메시지 읽음 처리 */
export const markMessageAsRead = async (messageId: number): Promise<void> => {
  await apiClient.post(`/messages/${messageId}/read`);
};
