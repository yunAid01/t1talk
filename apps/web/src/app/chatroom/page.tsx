'use client';
import { useQuery } from '@tanstack/react-query';
import { getUserChatRooms } from '@/api/chatroom';
import {
  ChatRoomsListResponseType,
  MyFriendsResponseType,
} from '@repo/validation';

// components
import ChatRoomPageEmptyState from '@/components/chatroom/ChatroomPageEmptyState';
import ChatRoomPageHeader from '@/components/chatroom/ChatroomPageHeader';
import ChatRoomPageCard from '@/components/chatroom/ChatroomPageCard';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { findFriends } from '@/api/friend';
import { selectCurrentUser } from '@/store/features/authSlice';

export default function ConversationsPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  // get conversation rooms
  const {
    data: conversationRooms,
    isLoading: isLoadingConversationRooms,
    isError: isErrorConversationRooms,
    error: errorConversationRooms,
  } = useQuery<ChatRoomsListResponseType>({
    queryKey: ['chatRooms'],
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
    queryKey: ['myFriends'], // cash 이용하기
    queryFn: () => findFriends(),
    initialData: [],
  });
  const myFriendsIds = friends.map((f) => f.friend.id);
  const isMyFriends = (userId: number) => {
    const result = myFriendsIds.includes(userId) ? true : false;
    return result;
  };

  const handleOpenCreateChatroomModal = () => {
    dispatch(openModal({ modalType: 'CREATE_CHATROOM' }));
  };

  if (isLoadingConversationRooms || isLoadingFriends) {
    return <Loading message="Loading conversations..." />;
  }

  if (isErrorConversationRooms) {
    return (
      <Error
        message="Failed to load conversations"
        error={errorConversationRooms}
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
      <ChatRoomPageHeader openModal={handleOpenCreateChatroomModal} />
      {/* 채팅방 목록 */}
      <div className="px-6 py-6">
        {conversationRooms && conversationRooms.length > 0 ? (
          <div className="max-w-2xl min-w-[320px] mx-auto space-y-3">
            {conversationRooms.map((room) => {
              const otherUsers = room.users.filter(
                (u) => u.id !== currentUser?.id,
              );
              const areAllMyFriends = otherUsers.every((u) =>
                isMyFriends(u.id),
              );
              if (otherUsers.length === 1 && otherUsers[0]) {
                return (
                  <ChatRoomPageCard
                    key={room.id}
                    chatroom={room}
                    otherUser={otherUsers[0]}
                    isFriend={areAllMyFriends}
                  />
                );
              } else if (otherUsers.length > 1) {
                return (
                  <ChatRoomPageCard
                    key={room.id}
                    chatroom={room}
                    otherUsers={otherUsers}
                    isFriend={areAllMyFriends}
                  />
                );
              }
            })}
          </div>
        ) : (
          <ChatRoomPageEmptyState />
        )}
      </div>
    </div>
  );
}
