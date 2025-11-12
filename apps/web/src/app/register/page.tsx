"use client";
import RegisterForm from "@/components/forms/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* 배경 데코레이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-red-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-red-900/10 rounded-full blur-3xl"></div>
      </div>

      {/* 회원가입 카드 */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-gradient-to-br from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-red-900/30 shadow-2xl shadow-red-900/20 overflow-hidden">
          {/* 헤더 */}
          <div className="relative border-b border-red-900/30 bg-gradient-to-r from-red-900/20 to-transparent px-8 py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
              JOIN T1
            </h1>
            <p className="text-gray-500 text-sm">
              Create your account to get started
            </p>
          </div>

          {/* 폼 영역 */}
          <div className="p-8">
            <RegisterForm />
          </div>

          {/* 하단 링크 */}
          <div className="border-t border-gray-800 px-8 py-6 bg-gray-900/50">
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-red-500 hover:text-red-400 font-semibold transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
