import Image from "next/image";
import { selectCurrentUser } from "@/store/features/authSlice";
import { useSelector } from "react-redux";
import type { AppState } from "@/store/store";
import { getFriendDetails } from "@/api/friend";
import { useQuery } from "@tanstack/react-query";
import { FriendDetailsResponseType } from "@repo/validation";
import { useDispatch } from "react-redux";

// mutations
import { useDeleteFavoriteMutation } from "@/hooks/friend/useDeleteFavoriteMutation";
import { useCreateChatRoomMutation } from "@/hooks/conversation/useCreateChatroomMutation";
import { useSocket } from "@/contexts/SocketContext";
import { closeModal, openModal } from "@/store/features/modalSlice";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import OnlineIndicator from "@/components/common/OnlineIndicator";
import Link from "next/link";
import { useCreateFavoriteMutation } from "@/hooks/friend/useCreateFavoriteMutation";
import UserDetailButton from "@/components/user/UserDetailButton";

export default function UserDetailModal() {
  const dispatch = useDispatch();
  const { isUserOnline } = useSocket();
  const currentUser = useSelector(selectCurrentUser);
  const modalProps = useSelector((state: AppState) => state.modal.modalProps);
  const userId: number = modalProps?.userId;

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery<FriendDetailsResponseType>({
    queryKey: ["userDetails", userId],
    queryFn: () => getFriendDetails(userId),
    enabled: !!userId,
  });

  const { mutate: createChatRoomMutate } = useCreateChatRoomMutation();
  const { mutate: createFavoriteMutate } = useCreateFavoriteMutation();
  const { mutate: deleteFavoriteMutate } = useDeleteFavoriteMutation();

  const handleAddFriend = async () => {
    dispatch(
      openModal({ modalType: "FRIEND_CREATE", modalProps: { userId: userId } })
    );
  };

  const handleOpenDeleteFriendModal = () => {
    dispatch(
      openModal({ modalType: "FRIEND_DELETE", modalProps: { userId: userId } })
    );
  };

  const handleCreateChatRoom = () => {
    createChatRoomMutate(userId);
  };

  const handleCreateFavorite = (userId: number) => {
    createFavoriteMutate(userId);
  };

  const handleDeleteFavorite = (userId: number) => {
    dispatch(
      openModal({ modalType: "FAVORITE_DELETE", modalProps: { userId: userId } })
    );
  };

  const handleFriendBlock = () => {
    dispatch(
      openModal({ modalType: "FRIEND_BLOCK", modalProps: { userId: userId } })
    );
  };

  // 로딩 �?  if (isLoading) {
    return <Loading message="Loading player details..." />;
  }

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
      {/* 배경 ?��?지/커버 ?�역 */}
      <div className="relative h-32 bg-gradient-to-r from-red-900/40 to-red-600/40 border-b border-red-900/50">
        <div className="absolute inset-0 bg-[url('/images/t1-pattern.png')] opacity-10 bg-cover bg-center"></div>

        {/* ?�로???��?지 - ?�단 중앙??반�? 걸치�?*/}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {/* ?��? ?�드 글로우 */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-lg opacity-75"></div>

            {/* ?�로???��?지 */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800">
              <Image
                src={
                  userDetails.profileImageUrl ||
                  "/images/default-profileImage.jpg"
                }
                alt={userDetails.nickname}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>

            {/* ?�라???�태 */}
            {isUserOnline(userDetails.id) && <OnlineIndicator />}
          </div>
        </div>
      </div>

      {/* ?��? ?�보 ?�역 */}
      <div className="pt-20 pb-6 px-6">
        {/* ?�네??*/}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
          {userDetails.nickname}
        </h2>

        {/* ?�태 메시지 */}
        {userDetails.statusMessage && (
          <p className="text-center text-gray-400 text-sm mb-6">
            &ldquo;{userDetails.statusMessage}&rdquo;
          </p>
        )}

        {/* 친구 ?�태 배�? */}
        <div className="flex justify-center gap-2 mb-6">
          {userDetails.isFriend && (
            <span className="px-3 py-1 bg-green-900/30 border border-green-700/50 text-green-400 text-xs font-semibold rounded-full">
              ??FRIEND
            </span>
          )}
          {userDetails.isFavorite && (
            <span
              onClick={handleDeleteFavorite}
              className="px-3 py-1 bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-xs font-semibold rounded-full"
            >
              �?FAVORITE
            </span>
          )}
        </div>

        {/* 구분??*/}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mb-6"></div>

        {/* ?�션 버튼??*/}
        <div className="space-y-3">
          {currentUser && currentUser.id !== userDetails.id && (
            <>
              {/* START CHAT 버튼 (친구???�만) */}
              {userDetails.isFriend && (
                <UserDetailButton
                  message="?�� START CHAT"
                  onClick={handleCreateChatRoom}
                  className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                />
              )}

              {/* 친구 추�?/??�� */}
              {!userDetails.isFriend ? (
                <UserDetailButton
                  message="ADD TO FRIENDS"
                  onClick={handleAddFriend}
                  className="w-full px-6 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                />
              ) : (
                <div className="flex gap-2">
                  <UserDetailButton
                    message="DELETE FRIEND"
                    onClick={handleOpenDeleteFriendModal}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
                  />
                  {!userDetails.isFavorite ? (
                    <UserDetailButton
                      message="�?FAVORITE"
                      onClick={handleCreateFavorite}
                      className="flex-1 px-4 py-3 bg-linear-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-semibold rounded-lg shadow-md shadow-yellow-900/40 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                    />
                  ) : (
                    <UserDetailButton
                      message="??UNFAVORITE"
                      onClick={handleDeleteFavorite}
                      className="flex-1 px-4 py-3 bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 hover:text-yellow-300 font-semibold rounded-lg border border-yellow-700/50 hover:border-yellow-600 transition-all duration-200 flex items-center justify-center gap-2"
                    />
                  )}
                  {!userDetails.isBlocked && (
                    <UserDetailButton
                      message="?�� BLOCK"
                      onClick={handleFriendBlock}
                      className="flex-1 px-4 py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 font-semibold rounded-lg border border-red-700/50 hover:border-red-600 transition-all duration-200 flex items-center justify-center gap-2"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* 추�? ?�보 (?�택?�항) */}
        {currentUser && currentUser.id === userDetails.id && (
          <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <Link onClick={() => dispatch(closeModal())} href={"/config"}>
              <p className="text-center text-sm text-gray-400">
                Configure your profile! ?��
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

