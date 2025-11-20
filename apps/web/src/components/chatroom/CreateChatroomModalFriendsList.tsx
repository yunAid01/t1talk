import { IMAGE_URL } from '@/constants/imageUrl';
import Image from 'next/image';

interface Props {
  onClick: () => void;
  isSelected: boolean;
  friend: {
    id: number;
    createdAt: Date;
    userId: number;
    friendId: number;
    isFavorite: boolean;
    isBlocked: boolean;
    friend: {
      nickname: string;
      id: number;
      statusMessage: string | null;
      profileImageUrl: string | null;
      backgroundImageUrl: string | null;
    };
  };
}

export default function ChatroomModalFriendsList({
  onClick,
  isSelected,
  friend,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-red-900/30 border-2 border-red-700/50'
          : 'bg-gray-800/30 border-2 border-transparent hover:border-gray-700'
      }`}
    >
      {/* 프로필 이미지 */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 mr-3">
        <Image
          src={friend.friend.profileImageUrl || IMAGE_URL.DEFAULT.PROFILE}
          alt={friend.friend.nickname || 'Friend Profile'}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      {/* 친구 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">
          {friend.friend.nickname}
        </h3>
        {friend.friend.statusMessage && (
          <p className="text-gray-500 text-sm truncate">
            {friend.friend.statusMessage}
          </p>
        )}
      </div>

      {/* 체크박스 */}
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          isSelected ? 'bg-red-600 border-red-600' : 'border-gray-600'
        }`}
      >
        {isSelected && (
          // 체크 아이콘
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
