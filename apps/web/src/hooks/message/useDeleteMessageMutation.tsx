import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMessage } from '@/api/message';
import toast from 'react-hot-toast';

export const useDeleteMessageMutation = (chatRoomId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatRoomId] });
      toast.success('메시지가 삭제되었습니다');
    },
    onError: (error) => {
      console.error('delete message failed', error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error('메시지 삭제에 실패했습니다');
    },
  });
};
