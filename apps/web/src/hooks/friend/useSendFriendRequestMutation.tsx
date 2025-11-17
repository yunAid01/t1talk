'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { sendFriendRequest } from '@/api/friend';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useSendtFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success('send friends request successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTMYFRIENDS.LIST });
      dispatch(closeModal());
    },
    onError: (error) => {
      console.error('send friend request failed', error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error('Failed to send friend request');
    },
  });
};
