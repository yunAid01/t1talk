import { MessageSquare } from "lucide-react";

export default function EmptyChatState() {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 아이콘 */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-red-600/10 rounded-full flex items-center justify-center border-2 border-red-900/30">
            <MessageSquare size={48} className="text-red-600/70" />
          </div>
        </div>

        {/* 텍스트 */}
        <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-3">
          No Messages Yet
        </h3>
        <p className="text-gray-500 text-sm">
          Start the conversation by sending your first message
        </p>
      </div>
    </div>
  );
}
