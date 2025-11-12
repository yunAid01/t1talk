import { useMutation } from "@tanstack/react-query";
import { userRegister } from "../api/auth"; // 👈 1단계에서 만든 API 함수
import { useRouter } from "next/navigation";

/**
 * 🚀 회원가입 전용 커스텀 Mutation 훅
 */
export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    // 1. (mutationFn): 1단계에서 만든 API 호출 함수를 지정합니다.
    mutationFn: userRegister,
    onSuccess: () => {
      router.push("/login"); // 로그인 후 홈으로 리다이렉트
      console.log("회원가입 성공");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error.message);
    },
  });
};
