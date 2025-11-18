'use client';

// 1. 프로필 사진이 없을 때 기본 이미지를 사용합니다.
import Image from 'next/image';
import { Star } from 'lucide-react';

// redux
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { useSocket } from '@/contexts/SocketContext';
import OnlineIndicator from '../common/OnlineIndicator';
import { IMAGE_URL } from '@/constants/imageUrl';

interface UserCardProps {
  modalName?: string;
  isFriend?: boolean;
  isFavorite?: boolean;
  user: {
    id: number;
    nickname: string;
    backgroundImageUrl?: string | null;
    profileImageUrl?: string | null; // 2. 프로필 이미지 URL (선택적)
    statusMessage?: string | null; // 3. 상태 메시지 (선택적)
  };
}

export default function UserCard({
  modalName,
  isFavorite,
  isFriend,
  user,
}: UserCardProps) {
  const { isUserOnline } = useSocket();

  const dispatch = useDispatch();
  const handleUserDetailModalOpen = () => {
    dispatch(
      openModal({ modalType: 'USER_DETAIL', modalProps: { userId: user.id } }),
    );
  };

  const handleNotMyUserDetailModalOpen = () => {
    dispatch(
      openModal({
        modalType: 'NOT_MY_FRIEND_DETAIL',
        modalProps: { userId: user.id, modalName: modalName },
      }),
    );
  };

  return (
    <div
      onClick={
        !isFriend
          ? () => handleNotMyUserDetailModalOpen()
          : () => handleUserDetailModalOpen()
      }
      className="flex items-center p-3 space-x-3 cursor-pointer group rounded-lg hover:bg-gray-900/50 transition-colors duration-200 relative overflow-hidden"
    >
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

      {/* 프로필 이미지 영역 - T1 스타일 */}
      <div className="relative shrink-0 z-10">
        {/* 외부 레드 글로우 링 */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>

        {/* 프로필 이미지 */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-red-700 transition-colors duration-300">
          <Image
            src={user.profileImageUrl || IMAGE_URL.DEFAULT.PROFILE}
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
      <div className="grow min-w-0 z-10 relative">
        <div className="flex items-center gap-4">
          <h2
            className={`text-sm font-bold truncate transition-colors duration-200 ${isFavorite ? 'text-yellow-300' : 'text-white group-hover:text-red-500'}`}
          >
            {user.nickname}
          </h2>
          {/* isFavorite일 때 별 6개 (닉네임 옆) */}
          {isFavorite && (
            <div className="flex gap-0.5 shrink-0">
              {[...Array(6)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 text-yellow-500/50 group-hover:text-yellow-500/70 transition-colors duration-300"
                  fill="currentColor"
                />
              ))}
            </div>
          )}
        </div>
        {user.statusMessage && (
          <p className="text-xs text-gray-400 group-hover:text-gray-200 truncate transition-colors duration-200">
            {user.statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
