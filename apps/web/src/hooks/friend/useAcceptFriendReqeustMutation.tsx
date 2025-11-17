'use client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { acceptFriendRequest } from '@/api/friend';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useAcceptFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success('Friend added successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTMYFRIENDS.LIST });
      dispatch(closeModal());
    },
    onError: (error) => {
      console.error('add friend failed', error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error('Failed to add friend');
    },
  });
};
