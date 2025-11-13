import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MessageType } from '@repo/validation';
import { deleteMessage } from '@/api/message';

export const useDeleteMessageMutation = (chatRoomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onMutate: async (messageId: number) => {
      await queryClient.cancelQueries({ queryKey: ['messages', chatRoomId] });
      const previousMessages = queryClient.getQueryData<MessageType[]>([
        'messages',
        chatRoomId,
      ]);
      queryClient.setQueryData<MessageType[]>(
        ['messages', chatRoomId],
        (old) => {
          if (!old) return [];
          return old.map((msg) =>
            msg.id === messageId ? { ...msg, isDeleted: true } : msg,
          );
        },
      );

      return { previousMessages };
    },
    onSuccess: () => {
      toast.success('메시지가 삭제되었습니다');
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['messages', chatRoomId] });
    },
    onError: (_error, _messageId, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['messages', chatRoomId],
          context.previousMessages,
        );
      }
      toast.error('메시지 삭제에 실패했습니다');
    },
  });
};
