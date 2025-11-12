import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
  message?: string;
  error?: Error;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export default function Error({
  message = "Something went wrong",
  error,
  onRetry,
  fullScreen = true,
}: ErrorProps) {
  const containerClass = fullScreen
    ? "flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    : "flex items-center justify-center py-20";

  return (
    <div className={containerClass}>
      <div className="text-center max-w-md px-6">
        {/* 에러 아이콘 */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          {/* 외부 글로우 */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
          {/* 아이콘 배경 */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-red-900/30 to-red-600/20 rounded-full flex items-center justify-center border border-red-800/50">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* 에러 제목 */}
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-3">
          Oops! Error Occurred
        </h2>

        {/* 에러 메시지 */}
        <p className="text-gray-400 mb-2">{message}</p>

        {/* 상세 에러 (개발 환경) */}
        {error && process.env.NODE_ENV === "development" && (
          <p className="text-xs text-gray-600 mb-6 font-mono bg-gray-900/50 p-3 rounded border border-gray-800">
            {error.message}
          </p>
        )}

        {/* 재시도 버튼 */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        {/* 홈으로 돌아가기 */}
        {!onRetry && (
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600"
          >
            Go to Home
          </a>
        )}
      </div>
    </div>
  );
}
