'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { MessageType } from '@repo/validation';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getMyProfile } from '@/api/user';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<number>; // 온라인 사용자 ID 목록
  isUserOnline: (userId: number) => boolean; // 특정 사용자가 온라인인지 확인
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  isUserOnline: () => false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: myData } = useQuery({
    queryKey: QUERY_KEYS.MYPROFILE.DETAILS,
    queryFn: () => getMyProfile(),
  });
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!currentUser || !myData) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Socket.io 연결
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
      // 연결 끊기면 온라인 사용자 목록 초기화
      setOnlineUsers(new Set());
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // 🆕 초기 온라인 사용자 목록 수신
    socketInstance.on('online_users', (userIds: number[]) => {
      console.log('📋 Initial online users:', userIds);
      setOnlineUsers(new Set(userIds));
    });

    // 🆕 사용자 온라인 상태 변경
    socketInstance.on('user_online', (data: { userId: number }) => {
      console.log('🟢 User came online:', data.userId);
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    });

    // 🆕 사용자 오프라인 상태 변경
    socketInstance.on('user_offline', (data: { userId: number }) => {
      console.log('🔴 User went offline:', data.userId);
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    // 메세지 수신 알람
    socketInstance.on('message_notification', (message: MessageType) => {
      if (!myData || !myData.isMessageNotificationOn) return;
      console.log('💬 New message received via socket:', message);
      const isViewingChatRoom = pathname.includes(
        `/chatroom/${message.chatRoomId}`,
      );
      if (isViewingChatRoom) return;
      toast.success(`${message.sender.nickname}: ${message.content}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
    });

    // 친구 추가 수신 알람
    socketInstance.on('new_friend_request', () => {
      if (!myData || !myData.isFriendNotificationOn) return;
      toast.success(`새로운 친구 요청이 왔습니다!`);
    });

    socketInstance.on('friend_request_accepted', () => {
      if (!myData || !myData.isFriendNotificationOn) return;
      toast.success(`친구 요청이 수락되었습니다!`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST });
    });

    // 채팅방 입장 이벤트 (기존 유지)
    socketInstance.on(
      'user_joined',
      (data: { userId: number; chatRoomId: number }) => {
        console.log('👤 User joined room:', data);
      },
    );

    // 채팅방 퇴장 이벤트 (기존 유지)
    socketInstance.on(
      'user_left',
      (data: { userId: number; chatRoomId: number }) => {
        console.log('👋 User left room:', data);
      },
    );

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, [currentUser, myData]);

  const isUserOnline = (userId: number) => onlineUsers.has(userId);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, onlineUsers, isUserOnline }}
    >
      {children}
    </SocketContext.Provider>
  );
};
