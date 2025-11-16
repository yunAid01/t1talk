import { updateUser } from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateUserInputType } from '@repo/validation';
import { useDispatch } from 'react-redux';
import { updateCredentails } from '@/store/features/authSlice';

export const useUpdateUserMutation = (userId: number) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (updateData: updateUserInputType) => updateUser(updateData),
    onSuccess: (data) => {
      toast.success('유저 정보가 성공적으로 업데이트되었습니다.');
      // Redux store 업데이트
      const filteredData = Object.fromEntries(
        Object.entries(data.updatedData).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );
      dispatch(
        updateCredentails({
          updateData: filteredData,
        }),
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER.DETAILS(userId),
      });
    },
    onError: () => {
      toast.error('유저 정보 업데이트에 실패했습니다.');
    },
  });
};
