import { deleteMyAccount } from '@/api/user';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '@/store/features/authSlice';
import { closeModal } from '@/store/features/modalSlice';

export const useDeleteUserMutation = (userId: number) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => deleteMyAccount(userId),

    onSuccess: (data) => {
      toast.success('유저 정보가 삭제되었습니다.');
      dispatch(clearCredentials());
      dispatch(closeModal());
      window.location.href = '/login'; // 페이지 리다이렉트
    },

    onError: () => {
      toast.error('유저 정보 삭제에 실패했습니다.');
    },
  });
};
