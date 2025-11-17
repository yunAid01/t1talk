'use client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { rejectFriendRequest } from '@/api/friend';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/features/modalSlice';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useRejectFriendRequestMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      toast.success('Friend rejected successfully!');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTMYFRIENDS.LIST });
      dispatch(closeModal());
    },
    onError: (error) => {
      console.error('reject friend request failed', error);
      console.log(error?.message && `error log: ${error.message}`);
      toast.error('Failed to reject friend request');
    },
  });
};
