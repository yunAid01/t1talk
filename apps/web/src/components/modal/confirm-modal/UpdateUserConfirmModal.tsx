'use client';

import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';
import { User, X } from 'lucide-react';
import { useUpdateUserMutation } from '@/hooks/user/useUpdateUserMutation';
import { AppState } from '@/store/store';
import { updateUserInputType } from '@repo/validation';

export default function UpdateUserConfirmModal() {
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);
  const { mutate: userUpdate } = useUpdateUserMutation(user!.id);
  const updateData: updateUserInputType = useSelector(
    (state: AppState) => state.modal.modalProps.updateData,
  );

  const handleConfirmUpdate = () => {
    userUpdate(updateData);
    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl overflow-hidden border border-blue-900/30 p-8">
      {/* 아이콘 */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-xl opacity-50"></div>
          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-900/50 to-gray-900/50 rounded-full flex items-center justify-center border-2 border-blue-700/50">
            <User size={40} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent mb-3">
        UPDATE PROFILE
      </h2>

      {/* 메시지 */}
      <p className="text-center text-gray-400 mb-8">
        Are you sure you want to update your profile information?
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
          onClick={handleConfirmUpdate}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-900/50 transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <User size={20} />
          <span>UPDATE</span>
        </button>
      </div>
    </div>
  );
}
