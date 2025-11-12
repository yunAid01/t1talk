"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import {
  CreateMessageInputType,
  MessageType,
  MessageDeletedEventType,
} from "@repo/validation";

export const useChat = (chatRoomId: number) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectCurrentUser);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // 채팅방 입장
  useEffect(() => {
    if (!socket || !isConnected || !chatRoomId) return;

    console.log("Joining room:", chatRoomId);
    socket.emit("join_room", { chatRoomId });

    return () => {
      console.log("Leaving room:", chatRoomId);
      socket.emit("leave_room", { chatRoomId });
    };
  }, [socket, isConnected, chatRoomId]);

  // 새 메시지 수신
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: MessageType) => {
      console.log("New message received:", message);
      setMessages((prev) => [...prev, message]);

      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, queryClient]);

  // 메시지 삭제 이벤트
  useEffect(() => {
    if (!socket) return;

    const handleMessageDeleted = (data: MessageDeletedEventType) => {
      console.log("Message deleted:", data);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, isDeleted: true } : msg
        )
      );
    };

    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [socket]);

  // 타이핑 상태 수신
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: { userId: number; nickname: string }) => {
      console.log("User typing:", data);
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserStopTyping = (data: { userId: number }) => {
      console.log("User stopped typing:", data);
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !content.trim()) return;

      const messageData: CreateMessageInputType = {
        chatRoomId,
        content: content.trim(),
      };

      console.log("Sending message:", messageData);
      socket.emit("send_message", messageData);
    },
    [socket, chatRoomId]
  );

  // 메시지 삭제
  const deleteMessage = useCallback(
    (messageId: number) => {
      if (!socket) return;

      console.log("Deleting message:", messageId);
      socket.emit("delete_message", { messageId, chatRoomId });
    },
    [socket, chatRoomId]
  );

  // 타이핑 시작
  const startTyping = useCallback(() => {
    if (!socket || !currentUser) return;

    socket.emit("typing_start", {
      chatRoomId,
      userId: currentUser.id,
      nickname: currentUser.nickname,
    });
  }, [socket, chatRoomId, currentUser]);

  // 타이핑 종료
  const stopTyping = useCallback(() => {
    if (!socket || !currentUser) return;

    socket.emit("typing_stop", {
      chatRoomId,
      userId: currentUser.id,
    });
  }, [socket, chatRoomId, currentUser]);

  // 읽음 처리
  const markAsRead = useCallback(
    (messageId: number) => {
      if (!socket) return;

      socket.emit("mark_as_read", { messageId, chatRoomId });
    },
    [socket, chatRoomId]
  );

  return {
    messages,
    typingUsers,
    isConnected,
    sendMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    markAsRead,
  };
};
