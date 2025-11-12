"use client";

import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "@/store/features/modalSlice";
import { AppState } from "@/store/store";
import { MessageSquareOff } from "lucide-react";

export default function DeleteChatRoomConfirm() {
  const dispatch = useDispatch();
  const { mutate: deleteChatRoom } = useDeleteChatroomMutation();
  const modalProps = useSelector((state: AppState) => state.modal.modalProps);
  const chatRoomId = modalProps?.chatRoomId;

  const handleConfirm = () => {
    deleteChatRoom(chatRoomId);
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
        {/* 아이콘 */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center">
            <MessageSquareOff className="w-7 h-7 text-red-500" />
          </div>
        </div>

        {/* 제목 */}
        <h2 className="text-xl font-bold text-center text-white">
          채팅방을 나가시겠습니까?
        </h2>

        {/* 설명 */}
        <p className="text-sm text-gray-400 text-center">
          채팅방을 나가면 대화 내용이 모두 삭제됩니다.
        </p>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all shadow-lg shadow-red-900/30"
          >
            나가기
          </button>
        </div>
      </div>
    </div>
  );
}
function useDeleteChatroomMutation(): { mutate: any } {
  throw new Error("Function not implemented.");
}
