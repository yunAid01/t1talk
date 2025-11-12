import { useMutation } from '@tanstack/react-query';
import { userRegister } from '@/api/auth'; // 👈 1단계에서 만든 API 함수
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

/**
 * 🚀 회원가입 전용 커스텀 Mutation 훅
 */
export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    // 1. (mutationFn): 1단계에서 만든 API 호출 함수를 지정합니다.
    mutationFn: userRegister,
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      router.push('/login'); // 로그인 후 홈으로 리다이렉트
    },
    onError: (error) => {
      toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('회원가입 실패:', error.message);
    },
  });
};
