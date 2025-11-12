// styles
import { MessageSquarePlus } from "lucide-react";

interface ConversationPageHeaderProps {
  openModal: () => void;
}
export default function ConversationPageHeader({
  openModal,
}: ConversationPageHeaderProps) {
  return (
    <div className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              CONVERSATIONS
            </h1>
            <p className="text-gray-500 text-sm mt-1">Your active chats</p>
          </div>
          {/* 새 채팅 버튼 */}
          <button
            onClick={() => {
              openModal();
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <MessageSquarePlus size={20} />
            <span>NEW CHAT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
