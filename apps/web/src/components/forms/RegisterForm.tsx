'use client';
// hooks
import { useRegisterMutation } from '@/hooks/useRegisterMutation';

// react-hook-form
import { useForm } from 'react-hook-form';
import { UserCreateInputType, userCreateSchema } from '@repo/validation';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInputType>({
    resolver: zodResolver(userCreateSchema),
  });
  const { mutate: signup, isPending } = useRegisterMutation();

  const onSubmit = (formData: UserCreateInputType) => {
    signup(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* 이메일 입력 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* 닉네임 입력 */}
      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Nickname
        </label>
        <input
          id="nickname"
          type="text"
          placeholder="Choose your nickname"
          {...register('nickname')}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
        />
        {errors.nickname && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.nickname.message}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Create a strong password"
          {...register('password')}
          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200"
        />
        {errors.password && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span>CREATE ACCOUNT</span>
          </>
        )}
      </button>
    </form>
  );
}
