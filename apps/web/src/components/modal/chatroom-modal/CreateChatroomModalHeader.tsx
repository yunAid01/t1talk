import { MessageSquarePlus } from 'lucide-react';

export default function CreateChatroomModalHeader() {
  return (
    <div className="relative border-b border-red-900/30 bg-gradient-to-r from-red-900/20 to-transparent px-6 py-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-red-600/20 to-red-900/20 rounded-full flex items-center justify-center">
          <MessageSquarePlus size={20} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
          NEW CHAT
        </h2>
      </div>
      <p className="text-gray-500 text-sm"></p>
    </div>
  );
}
