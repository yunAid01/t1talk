import { QUERY_KEYS } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { findFriendRequests, FriendRequestResponseType } from '@/api/friend';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import UserCard from '@/components/user/UserCard';
import NotFound from '@/components/common/NotFound';
import { UserCircle } from 'lucide-react';

export default function FindFriendRequestModal() {
  const {
    data: userToSendFriendRequests,
    isLoading,
    isError,
    error,
  } = useQuery<FriendRequestResponseType[]>({
    queryKey: QUERY_KEYS.FRIENDS.LIST_REQUEST,
    queryFn: findFriendRequests,
    initialData: [],
  });

  if (isLoading) return <Loading message="loading friends request" />;

  if (isError)
    return (
      <Error
        error={error}
        onRetry={() => window.location.reload()}
        message="error loading friends request"
      />
    );
  return (
    <>
      {userToSendFriendRequests && userToSendFriendRequests.length > 0 ? (
        userToSendFriendRequests.map((user) => (
          <div key={user.id}>
            <UserCard
              isFriend={false}
              isFavorite={false}
              modalName="FRIEND_REQUEST_MODAL"
              user={user}
            />
          </div>
        ))
      ) : (
        <NotFound
          icon={<UserCircle size={48} />}
          description="친구추가를 보낸 유저가 없습니다..."
        />
      )}
    </>
  );
}
