import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, LogOut } from 'lucide-react';

// types
import type { ChatRoomUserType, ChatRoomItemType } from '@repo/validation';

// redux
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { IMAGE_URL } from '@/constants/imageUrl';

interface ChatRoomPageCardProps {
  isFriend: boolean;
  otherUsers: ChatRoomUserType[];
  chatRoom: ChatRoomItemType;
}
export default function ChatRoomPageCard({
  isFriend,
  otherUsers,
  chatRoom,
}: ChatRoomPageCardProps) {
  const dispatch = useDispatch();

  // 그룹 채팅 이름
  const groupName =
    (chatRoom.isGroup && chatRoom.name) ||
    `Group (${chatRoom.users.map((u) => u.user.nickname).join(', ')})`;

  // 1:1 채팅 이름
  const privateName =
    !chatRoom.isGroup && otherUsers[0] && otherUsers.length === 1
      ? otherUsers[0].user.nickname
      : 'Unknown User';

  const displayName = chatRoom.isGroup
    ? `##GroupChat #${groupName}`
    : `##Chat #${privateName}`;

  const displayImage = chatRoom.isGroup
    ? IMAGE_URL.DEFAULT.GROUP_CHATROOM
    : otherUsers[0]?.user.profileImageUrl || IMAGE_URL.DEFAULT.CHATROOM;

  const lastMessageText = chatRoom.lastMessage || 'No messages yet';
  const lastMessageTime = chatRoom.lastMessageAt
    ? new Date(chatRoom.lastMessageAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const unreadCount = chatRoom.unreadCount || 0;

  const handleDeleteChatRoom = (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이동 방지
    e.stopPropagation();
    dispatch(
      openModal({
        modalType: 'CHATROOM_DELETE',
        modalProps: { chatRoomId: chatRoom.id },
      }),
    );
  };

  return (
    <Link href={`/chatroom/${chatRoom.id}`}>
      <div className="group relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-red-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20 cursor-pointer">
        {/* 왼쪽 레드 라인 액센트 */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {/* T1 로고 배경 (오른쪽 치우침) */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 group-hover:opacity-10 transition-opacity duration-300">
          <Image
            src="/t1-logo.svg"
            alt="T1 Logo"
            width={80}
            height={40}
            className="object-contain"
          />
        </div>
        <div className="flex items-center p-3 space-x-3">
          {/* 프로필 이미지 */}
          <div className="relative shrink-0">
            {/* 외부 레드 글로우 링 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>

            {/* 프로필 이미지 */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-red-700 transition-colors duration-300">
              <Image
                src={displayImage}
                alt={displayName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          </div>

          {/* 채팅방 정보 */}
          <div className="grow min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-sm font-bold text-white group-hover:text-red-500 truncate transition-colors duration-200">
                {displayName}
                {!isFriend && (
                  <span className="ml-2 text-xs text-gray-500">
                    (<AlertCircle className="inline-block w-3 h-3" />
                    Not Friend Contain)
                  </span>
                )}
              </h3>
              {lastMessageTime && (
                <span className="text-xs text-gray-500 ml-2 shrink-0">
                  {lastMessageTime}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 truncate">{lastMessageText}</p>
          </div>

          {/* 안읽은 메시지 배지 */}
          {unreadCount > 0 && (
            <div className="shrink-0">
              <div className="w-5 h-5 bg-linear-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </div>
            </div>
          )}

          {/* 채팅방 나가기 버튼 */}
          <button
            onClick={handleDeleteChatRoom}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-600/20 rounded-lg"
            title="채팅방 나가기"
          >
            <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </Link>
  );
}
