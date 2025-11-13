'use client';

import { MessageType } from '@repo/validation';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

// mutation
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';

interface MessageBubbleProps {
  message: MessageType & { isMe: boolean };
  isGroup: boolean;
  chatRoomId: number;
  userCount: number;
}
export default function MessageBubble({
  message,
  isGroup,
  chatRoomId,
  userCount,
}: MessageBubbleProps) {
  const dispatch = useDispatch();

  const handleOpenDeleteMessageModal = () => {
    dispatch(
      openModal({
        modalType: 'MESSAGE_DELETE',
        modalProps: { messageId: message.id, chatRoomId },
      }),
    );
  };

  return (
    <div className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex gap-3 max-w-[70%] ${message.isMe ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {/* 프로필 이미지 (상대방만) */}
        {!message.isMe && (
          <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 shrink-0">
            <Image
              src={
                message.sender.profileImageUrl ||
                '/images/default-profileImage.jpg'
              }
              alt={message.sender.nickname}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
        )}

        {/* 메시지 버블 */}
        <div
          className={`flex flex-col ${message.isMe ? 'items-end' : 'items-start'}`}
        >
          {/* 보낸 사람 이름 (그룹챗 & 상대방만) */}
          {!message.isMe && isGroup && (
            <span className="text-xs text-gray-500 mb-1 px-2">
              {message.sender.nickname}
            </span>
          )}

          {/* 메시지 내용 */}
          <div
            className={`px-4 py-2.5 rounded-2xl relative group ${
              message.isMe
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/30'
                : 'bg-gray-800/80 text-white border border-gray-700'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message && message.isDeleted ? (
                <span className="italic text-gray-400 flex items-center gap-1">
                  <Trash2 size={14} />
                  삭제된 메시지입니다.
                </span>
              ) : (
                message.content
              )}
            </p>
            {/* meessage.id > 0 -> because of optimistic ui */}
            {message.isMe && !message.isDeleted && message.id > 0 && (
              <button
                onClick={handleOpenDeleteMessageModal}
                className="absolute -top-2 -right-2 p-1.5 bg-gray-900 rounded-full border border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:border-red-500"
                title="메시지 삭제"
              >
                <Trash2 size={14} className="text-gray-300 hover:text-white" />
              </button>
            )}
          </div>

          {/* 시간 & 읽음 표시 */}
          <div className="flex items-center gap-2 mt-1 px-2">
            <span className="text-xs text-gray-600">
              {new Date(message.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {!message.isDeleted &&
              (() => {
                const unreadCount =
                  userCount - (message.readReceipts.length + 1);
                if (unreadCount > 0) {
                  return (
                    <span className="text-xs text-yellow-500 font-medium">
                      {unreadCount}
                    </span>
                  );
                }
                return (
                  <span className="text-xs text-green-500 font-medium">
                    읽음
                  </span>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}
