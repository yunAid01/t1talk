'use client';

import {
  Users,
  UserPlus,
  MessageSquare,
  Settings,
  LogOutIcon,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

//redux
import { useDispatch, useSelector } from 'react-redux';
import type { AppState } from '@/store/store';
import { selectCurrentUser } from '@/store/features/authSlice';
import { openModal } from '@/store/features/modalSlice';

export default function NavBar() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) =>
    selectCurrentUser(state),
  );

  const handleMyFriendRequestModalOpen = () => {
    dispatch(
      openModal({
        modalType: 'FIND_REQUEST',
      }),
    );
  };

  const handleMyProfileOpen = () => {
    dispatch(
      openModal({
        modalType: 'USER_DETAIL',
        modalProps: { userId: currentUser?.id },
      }),
    );
  };

  const handleLogout = () => {
    dispatch(
      openModal({
        modalType: 'LOGOUT_CONFIRM',
      }),
    );
  };

  return (
    <nav className="shrink-0 w-20 h-screen bg-gray-900 flex flex-col items-center py-6 border-r border-gray-800">
      <div onClick={() => handleMyProfileOpen()}>
        {currentUser && currentUser.profileImageUrl ? (
          <div className="relative shrink-0 w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src={currentUser.profileImageUrl}
              alt={currentUser.nickname}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative shrink-0 w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src="/images/default-profileImage-v2.jpg"
              alt="Default Profile Image"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* 2. 메인 아이콘 (친구, 채팅) */}
      <div className="mt-10 flex flex-col gap-y-8">
        {/* 친구 아이콘 */}
        <Link href="/">
          <button className="text-gray-400 hover:text-white">
            <Users size={28} />
          </button>
        </Link>

        <button
          onClick={handleMyFriendRequestModalOpen}
          className="text-gray-400 hover:text-white"
        >
          <UserPlus size={28} />
        </button>

        {/* 채팅 아이콘 */}
        <Link href={'/chatroom'}>
          <button className="text-gray-400 hover:text-white">
            <MessageSquare size={28} />
          </button>
        </Link>

        {/* 설정 아이콘 */}
        <Link href={'/config'}>
          <button className="text-gray-400 hover:text-white">
            <Settings size={28} />
          </button>
        </Link>

        {/* 로그아웃 아이콘 */}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white"
        >
          <LogOutIcon size={28} />
        </button>
      </div>
    </nav>
  );
}
