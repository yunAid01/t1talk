'use client';
import UserCard from '@/components/user/UserCard';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

//api
import { findFriends } from '@/api/friend';

// redux
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { MyFriendsResponseType } from '@repo/validation';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';

export default function Home() {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/login');
    }
  }, []);

  const {
    data: friends,
    isLoading,
    isError,
    error,
  } = useQuery<MyFriendsResponseType>({
    queryKey: ['myFriends'],
    queryFn: () => findFriends(),
    initialData: [],
  });

  const handleOpenFindUserModal = () => {
    dispatch(openModal({ modalType: 'USER_FIND' }));
  };

  if (isLoading) {
    return <Loading message="친구 목록 불러오는 중..." />;
  }
  if (isError) {
    return (
      <Error
        message="친구 목록 불러오는 중 에러가 발생했습니다."
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 헤더 영역 */}
      <div className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                FRIENDS OF T1
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {friends.length} members online
              </p>
            </div>
            <button
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105"
              onClick={() => handleOpenFindUserModal()}
            >
              + ADD FRIEND
            </button>
          </div>
        </div>
      </div>

      {/* 친구 목록 영역 */}
      <div className="px-6 py-6">
        {friends.length > 0 ? (
          <div className="max-w-2xl min-w-[320px] mx-auto space-y-3">
            {friends.map((f) => (
              <div
                key={f.id}
                className="group relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-red-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20"
              >
                {/* 왼쪽 레드 라인 액센트 */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <UserCard user={f.friend} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-gray-900/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-red-700/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No friends yet
            </p>
            <p className="text-gray-600 text-sm">
              Start by adding some friends to chat!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
