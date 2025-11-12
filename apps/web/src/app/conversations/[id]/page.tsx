"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { useChat } from "@/hooks/useChat";

// api
import { getChatRoomMessages } from "@/api/message";
import { getUserChatRooms } from "@/api/chatroom";

// components
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBubble from "@/components/Chat/MessageBubble";
import MessageInput from "@/components/Chat/MessageInput";
import EmptyChatState from "@/components/Chat/EmptyChatState";
import TypingIndicator from "@/components/Chat/TypingIndicator";
import { useSocket } from "@/contexts/SocketContext";

// types
import { MessageType } from "@repo/validation";
import Loading from "@/components/Loding";

export default function ChatRoom() {
  const params = useParams();
  const chatRoomId = Number(params.id);
  const currentUser = useSelector(selectCurrentUser);
  const { isUserOnline } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 채팅방 목록에서 현재 채팅방 정보 가져오기
  const { data: chatRooms } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: getUserChatRooms,
  });
  const currentChatRoom = chatRooms?.find((room) => room.id === chatRoomId);

  // 메시지 목록 조회 (초기 로딩)
  const { data: initialMessages, isLoading: isLoadingMessages } = useQuery<
    MessageType[]
  >({
    queryKey: ["messages", chatRoomId],
    queryFn: () => getChatRoomMessages(chatRoomId),
    initialData: [],
    enabled: !!chatRoomId,
  });

  // Socket.io 연결 및 실시간 메시지
  const {
    messages: socketMessages,
    typingUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    markAsRead,
  } = useChat(chatRoomId);

  // 초기 메시지 + 실시간 메시지 합치기
  const allMessages = useMemo(() => {
    return [...(initialMessages || []), ...socketMessages];
  }, [initialMessages, socketMessages]);

  // 채팅방 입장 시 모든 안읽은 메시지 읽음 처리
  useEffect(() => {
    if (!currentUser || !initialMessages) return;

    // 내가 보낸 메시지가 아니고, 읽지 않은 메시지만 필터링
    const unreadMessages = initialMessages.filter(
      (msg) =>
        msg.senderId !== currentUser.id &&
        !msg.readReceipts.some((r) => r.userId === currentUser.id)
    );

    // 각 메시지를 읽음 처리
    unreadMessages.forEach((msg) => {
      markAsRead(msg.id);
    });
  }, [initialMessages, currentUser, markAsRead]);

  // 상대방 정보 (1:1 채팅인 경우)
  const otherUser = currentChatRoom?.users?.find(
    (u) => u.user.id !== currentUser?.id
  )?.user;

  const chatRoomName = currentChatRoom?.isGroup
    ? currentChatRoom?.name || `Group (${currentChatRoom?.users?.length})`
    : otherUser?.nickname || "Chat Room";

  const otherUserImage =
    otherUser?.profileImageUrl || "/images/default-profileImage.jpg";

  // 메시지 전송
  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  // 자동 스크롤 (새 메시지 수신 시)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // 로딩 상태
  if (isLoadingMessages) {
    return <Loading message="Loading chat messages..." fullScreen={false} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 헤더 */}
      <ChatHeader
        otherUserId={otherUser?.id || 0}
        chatRoomName={chatRoomName}
        otherUserImage={otherUserImage}
        isUserOnline={isUserOnline(otherUser?.id || 0) ? true : false}
      />

      {/* 연결 상태 표시 */}
      {!isConnected && (
        <div className="bg-yellow-900/50 text-yellow-200 text-center py-2 text-sm">
          ⚠️ Reconnecting to chat...
        </div>
      )}

      {/* 메시지 영역 */}
      {allMessages.length > 0 ? (
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {allMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={{
                ...msg,
                isMe: msg.senderId === currentUser?.id,
              }}
              isGroup={currentChatRoom?.isGroup || false}
            />
          ))}

          {/* 타이핑 중 표시 */}
          {typingUsers.size > 0 && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      ) : (
        <EmptyChatState />
      )}

      {/* 메시지 입력 영역 */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={startTyping}
        onTypingStop={stopTyping}
      />
    </div>
  );
}
