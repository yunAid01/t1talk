'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { findFriends } from '@/api/friend';
import { MyFriendsResponseType } from '@repo/validation';
import { MessageSquarePlus, Users, Search } from 'lucide-react';
import { QUERY_KEYS } from '@/constants/queryKeys';

// hooks
import {
  useCreateChatRoomMutation,
  useCreateGroupChatRoomMutation,
} from '@/hooks/chatroom/useCreateChatroomMutation';

// components
import CreateChatroomModalHeader from './CreateChatroomModalHeader';
import ChatroomModalFriendsList from './ChatroomModalFriendsList';

export default function CreateChatroomModal() {
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [groupName, setGroupName] = useState('');

  const { data: myFriends, isLoading } = useQuery<MyFriendsResponseType>({
    queryKey: QUERY_KEYS.FRIENDS.LIST,
    queryFn: findFriends,
    initialData: [],
  });

  const { mutate: createChatRoomMutate } = useCreateChatRoomMutation();
  const { mutate: createGroupChatRoomMutate } =
    useCreateGroupChatRoomMutation();

  const toggleFriend = (friendId: number) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const filteredFriends = myFriends?.filter((f) =>
    f.friend.nickname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreate = () => {
    if (selectedFriends.length !== 0 && selectedFriends.length > 1) {
      createGroupChatRoomMutate({
        // group
        friendIds: selectedFriends,
        name: groupName || undefined,
      });
    } else if (selectedFriends.length === 1) {
      // 1:1
      createChatRoomMutate(selectedFriends[0]!);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-red-900/30">
      <CreateChatroomModalHeader />

      {/* 컨텐츠 */}
      <div className="p-6">
        {/* 그룹 채팅 이름 (2명 이상 선택 시) */}
        {selectedFriends.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Group Name (Optional)
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
            />
          </div>
        )}

        {/* 검색 바 */}
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search friends..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* 선택된 친구 수 */}
        {selectedFriends.length > 0 && (
          <div className="mb-4 px-3 py-2 bg-red-900/20 border border-red-700/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-red-400">
              <Users size={16} />
              <span className="font-semibold">
                {selectedFriends.length} friend
                {selectedFriends.length > 1 ? 's' : ''} selected
              </span>
            </div>
          </div>
        )}

        {/* 친구 목록 */}
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredFriends && filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => {
              if (!friend.isBlocked) {
                const isSelected = selectedFriends.includes(friend.friend.id);
                return (
                  <ChatroomModalFriendsList
                    key={friend.id}
                    isSelected={isSelected}
                    onClick={() => toggleFriend(friend.friend.id)}
                    friend={friend}
                  />
                );
              }
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No friends found' : 'No friends available'}
            </div>
          )}
        </div>

        {/* 생성 버튼 */}
        <div className="mt-6">
          <button
            onClick={handleCreate}
            disabled={selectedFriends.length === 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <MessageSquarePlus size={20} />
            <span>
              CREATE CHAT
              {selectedFriends.length > 1 ? ' GROUP' : ''}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
