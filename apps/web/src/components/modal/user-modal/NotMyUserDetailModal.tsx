import Image from 'next/image';
import { selectCurrentUser } from '@/store/features/authSlice';
import { useSelector } from 'react-redux';
import type { AppState } from '@/store/store';
import {
  getNotMyFriendDetails,
  NotMyFriendDetailsResponseType,
} from '@/api/friend';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { useSocket } from '@/contexts/SocketContext';
import { openModal } from '@/store/features/modalSlice';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import OnlineIndicator from '@/components/common/OnlineIndicator';

// hooks
import NotFound from '@/components/common/NotFound';
import { IMAGE_URL } from '@/constants/imageUrl';
import { QUERY_KEYS } from '@/constants/queryKeys';

export default function NotMyUserDetailModal() {
  const dispatch = useDispatch();
  const { isUserOnline } = useSocket();
  // Redux에서 userId만 가져옴
  const modalProps = useSelector((state: AppState) => state.modal.modalProps);
  const userId: number = modalProps?.userId;
  const modalName: string = modalProps?.modalName;

  const {
    data: notMyFriendDetails,
    isLoading,
    isError,
    error,
  } = useQuery<NotMyFriendDetailsResponseType>({
    queryKey: QUERY_KEYS.NOTMYFRIENDS.DETAILS(userId),
    queryFn: () => getNotMyFriendDetails(userId),
    enabled: !!userId,
  });

  // 친구 추가 요청 보내기 핸들러
  const handleSendFriend = async () => {
    dispatch(
      openModal({
        modalType: 'FRIEND_REQUEST_SEND',
        modalProps: { userId: userId },
      }),
    );
  };

  // 친구 추가 요청 삭제 핸들러
  const handleDeleteFriendRequest = async () => {
    dispatch(
      openModal({
        modalType: 'FRIEND_REQUEST_DELETE',
        modalProps: { userId: userId },
      }),
    );
  };

  const handleFriendRequestConfirmModalOpen = async () => {
    dispatch(
      openModal({
        modalType: 'FRIEND_REQUEST_ACCEPT',
        modalProps: { userId: userId },
      }),
    );
  };

  // 로딩 중
  if (isLoading) {
    return <Loading message="Loading player details..." />;
  }

  // 데이터 없음
  if (!notMyFriendDetails) {
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
                src={
                  notMyFriendDetails.profileImageUrl ||
                  IMAGE_URL.DEFAULT.PROFILE
                }
                alt={notMyFriendDetails.nickname || 'User Profile'}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>

            {/* 온라인 상태 */}
            {isUserOnline(notMyFriendDetails.id) && <OnlineIndicator />}
          </div>
        </div>
      </div>

      {/* 유저 정보 영역 */}
      <div className="pt-20 pb-6 px-6">
        {/* 닉네임 */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
          {notMyFriendDetails.nickname}
        </h2>

        {/* 상태 메시지 */}
        {notMyFriendDetails.statusMessage && (
          <p className="text-center text-gray-400 text-sm mb-6">
            &ldquo;{notMyFriendDetails.statusMessage}&rdquo;
          </p>
        )}

        {/* 구분선 */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-6"></div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          {modalName === 'FRIEND_REQUEST_MODAL' && (
            <button
              onClick={handleFriendRequestConfirmModalOpen}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-900/50 hover:shadow-xl border border-green-800"
            >
              친구 요청 확인
            </button>
          )}

          {modalName === 'USER_FIND_MODAL' &&
            (notMyFriendDetails.hasSentFriendRequest ? (
              <button
                onClick={handleDeleteFriendRequest}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 hover:shadow-xl border border-red-800"
              >
                친구 요청 취소
              </button>
            ) : (
              <button
                onClick={handleSendFriend}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 hover:shadow-xl border border-blue-800"
              >
                친구 요청 보내기
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
