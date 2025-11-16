import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePassword } from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import toast from 'react-hot-toast';

export const useUpdatePasswordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => updatePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MYPROFILE.DETAILS });
    },
    onError: (error) => {
      toast.error(`비밀번호 변경에 실패했습니다 : ${error.message}`);
    },
  });
};
