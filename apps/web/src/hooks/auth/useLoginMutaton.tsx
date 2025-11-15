import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setCredentials } from '@/store/features/authSlice';
import { userLogin } from '@/api/auth';
import { useRouter } from 'next/navigation';

/** 로그인 전용 커스텀 Mutation 훅 */
export const useLoginMutation = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: {
            ...data.user,
            statusMessage: data.user.statusMessage ?? undefined,
            profileImageUrl: data.user.profileImage ?? undefined,
            createdAt:
              typeof data.user.createdAt === 'string'
                ? data.user.createdAt
                : (data.user.createdAt?.toISOString?.() ?? ''),
          },
          token: data.access_token,
        }),
      );
      queryClient.invalidateQueries({ queryKey: ['me'] });
      router.push('/');
      console.log('로그인 성공 및 RTK 저장 완료!');
    },

    onError: (error: any) => {
      console.error('로그인 실패:', error.message);
      console.error('에러 상세:', error.response?.data);
      console.error('상태 코드:', error.response?.status);
    },
  });
};
