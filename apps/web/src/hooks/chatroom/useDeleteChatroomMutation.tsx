'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//redux
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';

//api
import { deleteChatRoom } from '@/api/chatroom';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useDeleteChatRoomMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteChatRoom,
    onSuccess: () => {
      toast.success('채팅방이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
      dispatch(closeModal());
      router.push('/chatroom');
    },
    onError: (error) => {
      toast.error('채팅방 삭제에 실패했습니다.');
      console.error('채팅방 삭제 실패', error);
      console.log(error?.message && `error log: ${error.message}`);
    },
  });
};
