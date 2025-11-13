import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// api
import { createFriendBlock } from '@/api/friend';
// type
import { FriendDetailsResponseType } from '@repo/validation';

export const useCreateBlockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFriendBlock,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ['userDetails', userId] });
      const previousData = queryClient.getQueryData<FriendDetailsResponseType>([
        'userDetails',
        userId,
      ]);
      queryClient.setQueryData<FriendDetailsResponseType>(
        ['userDetails', userId],
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
      queryClient.invalidateQueries({ queryKey: ['myFriends'] });
    },
    onError: (error, userId, context) => {
      toast.error('Failed to create block');
      if (context?.previousData) {
        queryClient.setQueryData(['userDetails', userId], context.previousData);
      }
    },
  });
};
