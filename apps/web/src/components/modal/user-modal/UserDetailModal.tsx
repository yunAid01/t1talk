import Image from 'next/image';
import { selectCurrentUser } from '@/store/features/authSlice';
import { useSelector } from 'react-redux';
import type { AppState } from '@/store/store';
import { PlusCircle, User } from 'lucide-react';
import {
  createFriend,
  createFriendFavorite,
  getFriendDetails,
} from '@/api/friend';
import { useQuery } from '@tanstack/react-query';
import { FriendDetailsResponseType } from '@repo/validation';
import { useDispatch } from 'react-redux';

import { useCreateChatRoomMutation } from '@/hooks/chatroom/useCreateChatroomMutation';
import { useSocket } from '@/contexts/SocketContext';
import { openModal } from '@/store/features/modalSlice';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import OnlineIndicator from '@/components/common/OnlineIndicator';
import Link from 'next/link';
import UserDetailActionButton from '@/components/user/UserDetailButton';

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

  // 친구 추가 핸들러
  const handleAddFriend = async () => {
    dispatch(
      openModal({ modalType: 'FRIEND_CREATE', modalProps: { userId: userId } }),
    );
  };

  // 친구 삭제 modal open
  const handleOpenDeleteFriendModal = () => {
    dispatch(
      openModal({ modalType: 'FRIEND_DELETE', modalProps: { userId: userId } }),
    );
  };

  // friends favorite toggle
  const handleToggleCreateFavorite = () => {
    if (userDetails.isFavorite === true) {
      createFriendFavorite(userId);
    }
  };

  // 채팅창 생성
  const handleCreateChatRoom = () => {
    console.log(`채팅창 생성 요청: ${userId}`);
    createChatRoomMutate(userId);
  };

  // 로딩 중
  if (isLoading) {
    return <Loading message="Loading player details..." />;
  }

  // 데이터 없음
  if (!userDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400">Player not found</p>
      </div>
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
                src={
                  userDetails.profileImageUrl ||
                  '/images/default-profileImage.jpg'
                }
                alt={userDetails.nickname}
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
                  text="ADD FRIEND"
                  onClick={() => handleAddFriend()}
                  className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                />
              ) : (
                <div className="flex gap-2">
                  <UserDetailActionButton
                    text="MESSAGE"
                    onClick={() => handleCreateChatRoom()}
                    className="flex-1 px-4 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  />
                  {/* <UserDetailActionButton
                    text="BLOCK"
                    onClick={() => handleBlockUser()}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  /> */}
                  <UserDetailActionButton
                    text="REMOVE"
                    onClick={() => handleOpenDeleteFriendModal()}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-red-400 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  />
                  {!userDetails.isFavorite ? (
                    <UserDetailActionButton
                      text="FAVORITE"
                      onClick={() => handleToggleCreateFavorite()}
                      className="flex-1 px-4 py-3 bg-yellow-700 hover:bg-yellow-800 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    />
                  ) : (
                    <UserDetailActionButton
                      text="UNFAVORITE"
                      onClick={() => handleToggleCreateFavorite()}
                      className="flex-1 px-4 py-3 bg-gray-800 hover:bg-yellow-900/50 text-gray-300 hover:text-yellow-400 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 추가 정보 (선택사항) */}
        {currentUser && currentUser.id === userDetails.id && (
          <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
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
