"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/store/features/authSlice";
import { closeModal } from "@/store/features/modalSlice";
import { LogOut, X } from "lucide-react";

export default function LogoutConfirmModal() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleConfirmLogout = () => {
    // 로그아웃 처리
    dispatch(clearCredentials());
    dispatch(closeModal());
    router.push("/login");
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-red-900/30 p-8">
      {/* 아이콘 */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur-xl opacity-50"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-900/50 to-gray-900/50 rounded-full flex items-center justify-center border-2 border-red-700/50">
            <LogOut size={40} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-3">
        SIGN OUT
      </h2>

      {/* 메시지 */}
      <p className="text-center text-gray-400 mb-8">
        Are you sure you want to sign out?
      </p>

      {/* 버튼 그룹 */}
      <div className="flex gap-3">
        {/* 취소 버튼 */}
        <button
          onClick={handleCancel}
          className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <X size={20} />
          <span>CANCEL</span>
        </button>

        {/* 확인 버튼 */}
        <button
          onClick={handleConfirmLogout}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          <span>SIGN OUT</span>
        </button>
      </div>
    </div>
  );
}
