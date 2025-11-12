import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage("");
    // 메시지 전송 시 타이핑 종료
    if (onTypingStop) onTypingStop();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 타이핑 감지
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (onTypingStart && !typingTimeoutRef.current) {
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) onTypingStop();
      typingTimeoutRef.current = null;
    }, 1000); // 1초 동안 입력이 없으면 타이핑 종료
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-t border-red-900/30">
      <div className="flex items-end gap-3">
        {/* 첨부 파일 버튼 */}
        <button className="p-2.5 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group mb-1">
          <Paperclip
            size={22}
            className="text-gray-400 group-hover:text-red-500 transition-colors"
          />
        </button>

        {/* 입력 필드 */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all duration-200 resize-none min-h-[48px] max-h-[120px]"
            style={{ scrollbarWidth: "thin" }}
          />

          {/* 이모지 버튼 */}
          <button className="absolute right-3 bottom-3 p-1 hover:bg-red-900/20 rounded-lg transition-colors duration-200 group">
            <Smile
              size={20}
              className="text-gray-400 group-hover:text-red-500 transition-colors"
            />
          </button>
        </div>

        {/* 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105 disabled:hover:scale-100 mb-1"
        >
          <Send
            size={20}
            className={message.trim() ? "text-white" : "text-gray-500"}
          />
        </button>
      </div>
    </div>
  );
}
