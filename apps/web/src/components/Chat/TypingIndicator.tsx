export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-3 max-w-[70%]">
        {/* 프로필 이미지 공간 (일관성 유지) */}
        <div className="w-8 h-8 shrink-0"></div>

        {/* 타이핑 버블 */}
        <div className="px-5 py-3 rounded-2xl bg-gray-800/80 border border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
