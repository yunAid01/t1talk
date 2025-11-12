'use client';

// 1. 프로필 사진이 없을 때 기본 이미지를 사용합니다.
import Image from 'next/image';

// redux
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { useSocket } from '@/contexts/SocketContext';
import OnlineIndicator from '../common/OnlineIndicator';

interface UserCardProps {
  user: {
    id: number;
    nickname: string;
    profileImageUrl?: string | null; // 2. 프로필 이미지 URL (선택적)
    statusMessage?: string | null; // 3. 상태 메시지 (선택적)
  };
}

export default function UserCard({ user }: UserCardProps) {
  const { isUserOnline } = useSocket();

  const dispatch = useDispatch();
  const handleUserDetailModalOpen = () => {
    dispatch(
      openModal({ modalType: 'USER_DETAIL', modalProps: { userId: user.id } }),
    );
  };

  return (
    <div
      onClick={() => handleUserDetailModalOpen()}
      className="flex items-center p-3 space-x-3 cursor-pointer group rounded-lg hover:bg-gray-900/50 transition-colors duration-200"
    >
      {/* 프로필 이미지 영역 - T1 스타일 */}
      <div className="relative shrink-0">
        {/* 외부 레드 글로우 링 */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>

        {/* 프로필 이미지 */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-red-700 transition-colors duration-300">
          <Image
            src={user.profileImageUrl || '/images/default-profileImage.jpg'}
            alt={user.nickname}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>

        {/* 온라인 상태 인디케이터 */}
        {isUserOnline(user.id) && <OnlineIndicator />}
      </div>

      {/* 닉네임과 상태 메시지 영역 */}
      <div className="grow min-w-0">
        <h2 className="text-sm font-bold text-white group-hover:text-red-500 truncate transition-colors duration-200">
          {user.nickname}
        </h2>
        {user.statusMessage && (
          <p className="text-xs text-gray-400 group-hover:text-gray-200 truncate transition-colors duration-200">
            {user.statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
