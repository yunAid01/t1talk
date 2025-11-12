"use client";

// hooks
import { useDeleteFriendMutation } from "@/hooks/friend/useDeleteFriendMutation";
import { AppState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "@/store/features/modalSlice";

export default function DeleteFriendConfirmModal() {
  const dispatch = useDispatch();
  const modalProps = useSelector((state: AppState) => state.modal.modalProps);
  const userId: number = modalProps?.userId;
  const { mutate: deleteFriend } = useDeleteFriendMutation();

  const handleDelete = () => {
    deleteFriend(userId);
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl border border-red-900/30 p-6 max-w-md w-full shadow-2xl shadow-red-900/20">
      {/* 아이콘 */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-900/30 to-red-600/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
        Delete Friend
      </h2>

      {/* 설명 */}
      <p className="text-gray-400 text-center mb-6">
        Are you sure you want to remove this friend? This action cannot be
        undone.
      </p>

      {/* 버튼 그룹 */}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
