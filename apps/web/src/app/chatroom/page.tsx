'use client';

import { MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getUserChatRooms } from '@/api/chatroom';
import {
  ChatRoomsListResponseType,
  MyFriendsResponseType,
} from '@repo/validation';
import { QUERY_KEYS } from '@/constants/queryKeys';

// components
import ChatRoomPageCard from '@/components/chatroom/ChatroomPageCard';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { findFriends } from '@/api/friend';
import { selectCurrentUser } from '@/store/features/authSlice';
import MainHeader from '@/components/common/MainHeader';
import NotFound from '@/components/common/NotFound';

export default function ConversationsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // get conversation rooms
  const {
    data: chatRooms,
    isLoading: isLoadingChatRooms,
    isError: isErrorChatRooms,
    error: errorChatRooms,
  } = useQuery<ChatRoomsListResponseType>({
    queryKey: QUERY_KEYS.CHAT_ROOMS.LIST,
    queryFn: () => getUserChatRooms(),
    initialData: [],
  });

  // isMyFriends?
  const {
    data: friends,
    isLoading: isLoadingFriends,
    isError: isErrorFriends,
    error: errorFriends,
  } = useQuery<MyFriendsResponseType>({
    queryKey: QUERY_KEYS.FRIENDS.LIST,
    queryFn: () => findFriends(),
    initialData: [],
  });
  const myFriendsIds = friends.map((f) => f.friend.id);
  const isMyFriends = (userId: number) => {
    const result = myFriendsIds.includes(userId) ? true : false;
    return result;
  };

  if (isLoadingChatRooms || isLoadingFriends) {
    return <Loading message="Loading conversations..." />;
  }

  if (isErrorChatRooms) {
    return (
      <Error
        message="Failed to load conversations"
        error={errorChatRooms}
        onRetry={() => window.location.reload()}
      />
    );
  } else if (isErrorFriends) {
    return (
      <Error
        message="Failed to load friends"
        error={errorFriends}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 헤더 */}
      <MainHeader
        title="CONVERSATIONS"
        text="Select friends to start a conversation"
      />
      {/* 채팅방 목록 */}
      <div className="px-6 py-6">
        {chatRooms && chatRooms.length > 0 ? (
          <div className="max-w-2xl min-w-[320px] mx-auto space-y-3">
            {chatRooms.map((room) => {
              const otherUsers = room?.users.filter(
                (u) => u.user.id !== currentUser?.id,
              );
              const areAllFriends = otherUsers.every((user) =>
                isMyFriends(user.id),
              );
              return (
                <ChatRoomPageCard
                  key={room.id}
                  chatRoom={room}
                  otherUsers={otherUsers}
                  isFriend={areAllFriends}
                />
              );
            })}
          </div>
        ) : (
          <NotFound
            message="No conversations yet"
            description="Start a new chat to connect with your friends!"
            icon={<MessageCircle size={48} />}
          />
        )}
      </div>
    </div>
  );
}
