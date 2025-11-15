'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

//redux
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';

//api
import { createChatRoom, createGroupChatRoom } from '@/api/chatroom';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateChatRoomMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: (chatroomdata) => {
      toast.success('채팅방이 생성되었습니다!');
      dispatch(closeModal());
      router.push(`/chatroom/${chatroomdata.chatroomId}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
    },
    onError: (error) => {
      console.error('채팅방 생성 실패', error);
    },
  });
};

export const useCreateGroupChatRoomMutation = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupChatRoom,
    onSuccess: (chatroomdata) => {
      console.log('그룹 채팅방 생성 성공');
      dispatch(closeModal());
      router.push(`/chatroom/${chatroomdata.chatroomId}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHAT_ROOMS.LIST });
    },
    onError: (error) => {
      console.error('그룹 채팅방 생성 실패', error);
    },
  });
};
