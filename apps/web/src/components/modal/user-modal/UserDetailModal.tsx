import Image from 'next/image';
import { selectCurrentUser } from '@/store/features/authSlice';
import { useSelector } from 'react-redux';
import type { AppState } from '@/store/store';
import { getFriendDetails } from '@/api/friend';
import { useQuery } from '@tanstack/react-query';
import { FriendDetailsResponseType } from '@repo/validation';
import { useDispatch } from 'react-redux';

import { useCreateChatRoomMutation } from '@/hooks/chatroom/useCreateChatroomMutation';
import { useSocket } from '@/contexts/SocketContext';
import { closeModal, openModal } from '@/store/features/modalSlice';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import OnlineIndicator from '@/components/common/OnlineIndicator';
import Link from 'next/link';
import UserDetailActionButton from '@/components/user/UserDetailButton';

// hooks
import { useCreateFavoriteMutation } from '@/hooks/friend/useCreateFavoriteMutation';

import { useDeleteFavoriteMutation } from '@/hooks/friend/useDeleteFavoriteMutation';
import NotFound from '@/components/common/NotFound';
import { IMAGE_URL } from '@/constants/imageUrl';

export default function UserDetailModal() {
  const dispatch = useDispatch();
  const { isUserOnline } = useSocket();
  const currentUser = useSelector(selectCurrentUser);
  // Redux에서 userId만 가져옴
  const modalProps = useSelector((state: AppState) => state.modal.modalProps);
  const userId: number = modalProps?.userId;

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery<FriendDetailsResponseType>({
    queryKey: ['userDetails', userId],
    queryFn: () => getFriendDetails(userId),
    initialData: {} as FriendDetailsResponseType,
    enabled: !!userId,
  });

  const { mutate: createChatRoomMutate } = useCreateChatRoomMutation();
  const { mutate: createFavoriteMutate } = useCreateFavoriteMutation(userId);
  const { mutate: deleteFavoriteMutate } = useDeleteFavoriteMutation(userId);

  // 친구 추가 요청 보내기 핸들러
  const handleSendFriend = async () => {
    dispatch(
      openModal({
        modalType: 'FRIEND_REQUEST_SEND',
        modalProps: { userId: userId },
      }),
    );
  };

  // 친구 삭제 modal open
  const handleOpenDeleteFriendModal = () => {
    dispatch(
      openModal({ modalType: 'FRIEND_DELETE', modalProps: { userId: userId } }),
    );
  };

  // create friends favorite
  const handleCreateFavorite = () => {
    createFavoriteMutate();
  };

  //  delete friends favorite
  const handleDeleteFavorite = () => {
    deleteFavoriteMutate();
  };

  // create friend block
  const handleOpenCreateBlockModal = () => {
    dispatch(
      openModal({ modalType: 'BLOCK_CREATE', modalProps: { userId: userId } }),
    );
  };

  // delete friend block
  const handleOpenDeleteBlockModal = () => {
    dispatch(
      openModal({ modalType: 'BLOCK_DELETE', modalProps: { userId: userId } }),
    );
  };

  // 채팅창 생성
  const handleCreateChatRoom = () => {
    createChatRoomMutate(userId);
  };

  // 로딩 중
  if (isLoading) {
    return <Loading message="Loading player details..." />;
  }

  // 데이터 없음
  if (!userDetails) {
    return (
      <NotFound
        message="Player not found"
        description="플레이어를 찾을 수 없습니다.."
      />
    );
  }

  if (isError) {
    return (
      <Error
        message="Failed to load player details."
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden">
      {/* 배경 이미지/커버 영역 */}
      <div className="relative h-32 bg-gradient-to-r from-red-900/40 to-red-600/40 border-b border-red-900/50">
        <div className="absolute inset-0 bg-[url('/images/t1-pattern.png')] opacity-10 bg-cover bg-center"></div>

        {/* 프로필 이미지 - 하단 중앙에 반쯤 걸치게 */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* 외부 레드 글로우 */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-lg opacity-75"></div>

            {/* 프로필 이미지 */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800">
              <Image
                src={userDetails.profileImageUrl || IMAGE_URL.DEFAULT.PROFILE}
                alt={userDetails.nickname || 'User Profile'}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>

            {/* 온라인 상태 */}
            {isUserOnline(userDetails.id) && <OnlineIndicator />}
          </div>
        </div>
      </div>

      {/* 유저 정보 영역 */}
      <div className="pt-20 pb-6 px-6">
        {/* 닉네임 */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
          {userDetails.nickname}
        </h2>

        {/* 상태 메시지 */}
        {userDetails.statusMessage && (
          <p className="text-center text-gray-400 text-sm mb-6">
            &ldquo;{userDetails.statusMessage}&rdquo;
          </p>
        )}

        {/* 친구 상태 배지 */}
        <div className="flex justify-center gap-2 mb-6">
          {userDetails.isFriend && (
            <span className="px-3 py-1 bg-green-900/30 border border-green-700/50 text-green-400 text-xs font-semibold rounded-full">
              ✓ FRIEND
            </span>
          )}
          {userDetails.isFavorite && (
            <span className="px-3 py-1 bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-xs font-semibold rounded-full">
              ⭐ FAVORITE
            </span>
          )}
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-6"></div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          {currentUser && currentUser.id !== userDetails.id && (
            <>
              {!userDetails.isFriend ? (
                <UserDetailActionButton
                  text="SEND FRIEND REQUEST"
                  variant="add"
                  onClick={() => handleSendFriend()}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl"
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {/* 메시지 버튼 - 전체 너비 */}
                  <UserDetailActionButton
                    text="MESSAGE"
                    variant="message"
                    onClick={() => handleCreateChatRoom()}
                    className="col-span-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 border border-red-800"
                  />

                  {/* 차단/차단해제 */}
                  {!userDetails.isBlocked ? (
                    <UserDetailActionButton
                      text="BLOCK"
                      variant="block"
                      onClick={() => handleOpenCreateBlockModal()}
                      className="px-3 py-2.5 bg-gray-800/80 hover:bg-red-900/30 text-gray-300 hover:text-red-400 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-red-800"
                    />
                  ) : (
                    <UserDetailActionButton
                      text="UNBLOCK"
                      variant="unblock"
                      onClick={() => handleOpenDeleteBlockModal()}
                      className="px-3 py-2.5 bg-red-900/50 hover:bg-red-800/50 text-red-300 hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-red-800 hover:border-red-700"
                    />
                  )}

                  {/* 친구 삭제 */}
                  <UserDetailActionButton
                    text="REMOVE"
                    variant="remove"
                    onClick={() => handleOpenDeleteFriendModal()}
                    className="px-3 py-2.5 bg-gray-800/80 hover:bg-red-900/30 text-gray-300 hover:text-red-400 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-red-800"
                  />

                  {/* 즐겨찾기 추가/제거 */}
                  {!userDetails.isFavorite ? (
                    <UserDetailActionButton
                      text="FAVORITE"
                      variant="favorite"
                      onClick={() => handleCreateFavorite()}
                      className="col-span-2 px-4 py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-yellow-900/50 hover:shadow-xl hover:shadow-yellow-900/70 border border-yellow-800"
                    />
                  ) : (
                    <UserDetailActionButton
                      text="UNFAVORITE"
                      variant="unfavorite"
                      onClick={() => handleDeleteFavorite()}
                      className="col-span-2 px-4 py-2.5 bg-gray-800/80 hover:bg-yellow-900/30 text-gray-300 hover:text-yellow-400 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700 hover:border-yellow-800"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 추가 정보 (선택사항) */}
        {currentUser && currentUser.id === userDetails.id && (
          <div
            onClick={() => dispatch(closeModal())}
            className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
          >
            <Link href={'/config'}>
              <p className="text-center text-sm text-gray-400">
                Configure your profile! 👋
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
