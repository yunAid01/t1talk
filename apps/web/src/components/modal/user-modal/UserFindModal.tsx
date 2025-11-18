'use client';

import { useQuery } from '@tanstack/react-query';
// api
import { findNotMyFriends } from '@/api/friend';
// types
import { NotMyFriendsResponseType } from '@repo/validation';
// components
import UserCard from '../../user/UserCard';
import Loading from '../../common/Loding';
import Error from '../../common/Error';
import NotFound from '@/components/common/NotFound';
import { UserCircle } from 'lucide-react';

export default function UserFindModal() {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<NotMyFriendsResponseType>({
    queryKey: ['notMyFriends'],
    queryFn: () => findNotMyFriends(),
    initialData: [],
  });

  if (isLoading) {
    return <Loading message="Searching players..." />;
  }

  if (isError) {
    return (
      <Error
        message="유저를 찾는데 실패했습니다.."
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-red-900/30">
      {/* 헤더 */}
      <div className="relative border-b border-red-900/30 bg-gradient-to-r from-red-900/20 to-transparent">
        <div className="px-6 py-5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            FIND PLAYERS
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Add new teammates to your roster
          </p>
        </div>
      </div>

      {/* 유저 목록 */}
      <div className="max-h-[500px] overflow-y-auto">
        {users && users.length > 0 ? (
          <div className="divide-y divide-gray-800/50">
            {users.map((user, index) => (
              <div
                key={user.id}
                className="group relative bg-gradient-to-r from-transparent to-transparent hover:from-red-900/10 hover:to-transparent transition-all duration-300"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* 왼쪽 레드 라인 */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* 온라인 상태 표시 */}
                <div className="relative">
                  <UserCard
                    isFriend={false}
                    modalName="USER_FIND_MODAL"
                    user={user}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NotFound
            icon={<UserCircle size={48} />}
            message="No players found to add..."
          />
        )}
      </div>
    </div>
  );
}
