'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { MessageType, MessageDeletedEventType } from '@repo/validation';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useChat = (chatRoomId: number) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectCurrentUser); // 현재 로그인한 사용자
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());

  // 채팅방 입장
  useEffect(() => {
    if (!socket || !isConnected || !chatRoomId) {
      toast.error(
        '소켓 연결이 되어 있지 않거나 채팅방 ID가 유효하지 않습니다.',
      );
      return;
    }
    socket.emit('join_room', { chatRoomId });

    return () => {
      socket.emit('leave_room', { chatRoomId });
    };
  }, [socket, isConnected, chatRoomId]);

  // 새 메시지 수신
  useEffect(() => {
    if (!socket) {
      toast.error('소켓이 연결되어 있지 않습니다.');
      return;
    }

    const handleNewMessage = (message: MessageType) => {
      if (message.senderId === currentUser?.id) return; // 내 메시지는 무시
      queryClient.setQueryData<MessageType[]>(
        QUERY_KEYS.MESSAGE.LIST(chatRoomId),
        (old) => {
          if (!old) return [message];
          if (old.some((msg) => msg.id === message.id)) return old; // 중복방지
          return [...old, message];
        },
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, queryClient, chatRoomId]);

  useEffect(() => {
    if (!socket) {
      toast.error('Socket connect Error...');
      return;
    }

    const handleMessageDeleted = (data: MessageDeletedEventType) => {
      queryClient.setQueryData<MessageType[]>(
        QUERY_KEYS.MESSAGE.LIST(chatRoomId),
        (old) => {
          if (!old) return [];
          return old.map((msg) =>
            msg.id === data.messageId ? { ...msg, isDeleted: true } : msg,
          );
        },
      );
    };

    socket.on('message_deleted', handleMessageDeleted);
    return () => {
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [socket, queryClient, chatRoomId]);

  // 타이핑 상태 수신
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: { userId: number; nickname: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserStopTyping = (data: { userId: number }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket]);

  // 실시간 채팅 읽음 수신
  useEffect(() => {
    if (!socket) return;

    const handleReadMessage = (data: {
      messageId: number;
      userId: number;
      readAt: Date | string;
    }) => {
      queryClient.setQueryData<MessageType[]>(
        QUERY_KEYS.MESSAGE.LIST(chatRoomId),
        (old) => {
          if (!old) return [];
          return old.map((msg) => {
            if (msg.id !== data.messageId) return msg;
            const isAlreadyRead = msg.readReceipts.some(
              (receipt) => receipt.userId === data.userId,
            );
            if (isAlreadyRead) return msg;
            return {
              ...msg,
              readReceipts: [
                ...msg.readReceipts,
                {
                  userId: data.userId,
                  readAt: new Date(data.readAt), // 날짜 객체로 변환
                },
              ],
            };
          });
        },
      );
    };

    socket.on('message_read', handleReadMessage);

    return () => {
      socket.off('message_read', handleReadMessage); // cleanup
    };
  }, [queryClient, socket, chatRoomId]);

  // 타이핑 시작
  const startTyping = useCallback(() => {
    if (!socket || !currentUser) return;

    socket.emit('typing_start', {
      chatRoomId,
      userId: currentUser.id,
      nickname: currentUser.nickname,
    });
  }, [socket, chatRoomId, currentUser]);

  // 타이핑 종료
  const stopTyping = useCallback(() => {
    if (!socket || !currentUser) return;

    socket.emit('typing_stop', {
      chatRoomId,
      userId: currentUser.id,
    });
  }, [socket, chatRoomId, currentUser]);

  return {
    typingUsers,
    isConnected,
    startTyping,
    stopTyping,
  };
};
