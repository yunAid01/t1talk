import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// api
import { createFriendBlock } from '@/api/friend';
// type
import { FriendDetailsResponseType } from '@repo/validation';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFriendBlock,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.FRIENDS.DETAILS(userId),
      });
      const previousData = queryClient.getQueryData<FriendDetailsResponseType>(
        QUERY_KEYS.FRIENDS.DETAILS(userId),
      );
      queryClient.setQueryData<FriendDetailsResponseType>(
        QUERY_KEYS.FRIENDS.DETAILS(userId),
        (old) => {
          if (!old) return undefined;
          return {
            ...old,
            isBlocked: true,
          };
        },
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success('Block created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST });
    },
    onError: (error, userId, context) => {
      toast.error('Failed to create block');
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.FRIENDS.DETAILS(userId),
          context.previousData,
        );
      }
    },
  });
};
