import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';

// redux
import { openModal } from '@/store/features/modalSlice';
import { useDispatch } from 'react-redux';
import OnlineIndicator from '../common/OnlineIndicator';

interface ChatHeaderProps {
  otherUserId: number;
  chatRoomName: string;
  otherUserImage: string;
  isUserOnline: boolean;
}

export default function ChatHeader({
  otherUserId,
  chatRoomName,
  otherUserImage,
  isUserOnline,
}: ChatHeaderProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-red-900/30">
      <div className="flex items-center gap-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.push('/conversations')}
          className="p-2 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
        >
          <ArrowLeft
            size={24}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
        </button>

        {/* 프로필 이미지 */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-50 blur"></div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-red-700">
            <Image
              onClick={() =>
                dispatch(
                  openModal({
                    modalType: 'USER_DETAIL',
                    modalProps: { userId: otherUserId },
                  }),
                )
              }
              src={otherUserImage}
              alt={chatRoomName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          {/* 온라인 표시 */}
          {isUserOnline && <OnlineIndicator />}
        </div>

        {/* 채팅방 정보 */}
        <div>
          <h1 className="text-lg font-bold text-white">{chatRoomName}</h1>
          <p className="text-sm text-gray-500">
            {isUserOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* todo - 우측 액션 버튼들 */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group">
          <Phone
            size={20}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
        </button>
        <button className="p-2 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group">
          <Video
            size={20}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
        </button>
        <button className="p-2 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group">
          <MoreVertical
            size={20}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
        </button>
      </div>
    </div>
  );
}
