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
import { QUERY_KEYS } from '@/constants/queryKeys';
import NotFound from '@/components/common/NotFound';
import MainHeader from '@/components/common/MainHeader';
import { User2Icon } from 'lucide-react';

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
    queryKey: QUERY_KEYS.FRIENDS.LIST,
    queryFn: () => findFriends(),
    initialData: [],
  });

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
      <MainHeader
        title="Friends of T1"
        text={`${friends.length} members online`}
      />

      {/* 친구 목록 영역 */}

      <div className="px-6 py-6">
        {friends.filter((friend) => friend.isBlocked === false).length > 0 ? (
          <div className="max-w-2xl min-w-[320px] mx-auto space-y-3">
            {friends
              .filter((friend) => friend.isBlocked === false)
              .map((friend) => (
                <div
                  key={friend.id}
                  className="group relative bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 hover:border-red-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-900/20"
                >
                  {/* 왼쪽 레드 라인 액센트 */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <UserCard
                    isFriend={true}
                    isFavorite={friend.isFavorite}
                    user={friend.friend}
                  />
                </div>
              ))}
          </div>
        ) : (
          <NotFound
            icon={<User2Icon size={48} />}
            message="No friends yet"
            description="Start by adding some friends to chat!"
          />
        )}
      </div>
    </div>
  );
}
