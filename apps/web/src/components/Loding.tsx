interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}
export default function Loading({
  message = "Loading...",
  fullScreen = true,
}: LoadingProps) {
  const containerClass = fullScreen
    ? "flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900"
    : "flex items-center justify-center py-20";

  return (
    <div className={containerClass}>
      <div className="text-center">
        {/* T1 스타일 로딩 스피너 */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* 외부 링 */}
          <div className="absolute inset-0 border-4 border-red-900/30 rounded-full"></div>
          {/* 회전하는 링 */}
          <div className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full animate-spin"></div>
          {/* 내부 펄스 */}
          <div className="absolute inset-2 bg-red-500/20 rounded-full animate-pulse"></div>
        </div>

        {/* 로딩 텍스트 */}
        <p className="text-gray-400 text-sm font-medium">{message}</p>

        {/* 로딩 도트 애니메이션 */}
        <div className="flex justify-center gap-1 mt-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
