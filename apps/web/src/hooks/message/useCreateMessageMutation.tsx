import { useMutation, useQueryClient } from '@tanstack/react-query';
// api
import { createMessage } from '@/api/message';
import { MessageType } from '@repo/validation';
// currnentUser
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateMessageMutation = (chatRoomId: number) => {
  const currentUser = useSelector(selectCurrentUser);

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      createMessage({ content: content, chatRoomId }),
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ['messages', chatRoomId] });
      const previousMessages = queryClient.getQueryData<MessageType[]>([
        'messages',
        chatRoomId,
      ]);

      /** optimistic message */
      const tempId = -Date.now();
      const tempMessage = (content: string): MessageType => ({
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        chatRoomId: chatRoomId,
        senderId: currentUser?.id || 0,
        content: content,
        isDeleted: false,
        sender: {
          id: currentUser?.id || 0,
          nickname: currentUser?.nickname || '',
          profileImageUrl:
            currentUser?.profileImageUrl || '/default-profile.png',
        },
        readReceipts: [],
      });

      queryClient.setQueryData<MessageType[]>(
        ['messages', chatRoomId],
        (old) => {
          if (!old) return [tempMessage(content)];
          return [...old, tempMessage(content)];
        },
      );
      return { previousMessages };
    },
    onSuccess: (realMessage) => {
      queryClient.setQueryData(
        QUERY_KEYS.MESSAGE.LIST(chatRoomId),
        (old: MessageType[]) =>
          old?.map((msg) => (msg.id < 0 ? realMessage : msg)),
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
    },
    onError: (_err, _messageId, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', chatRoomId],
          context.previousMessages,
        );
      }
    },
  });
};
