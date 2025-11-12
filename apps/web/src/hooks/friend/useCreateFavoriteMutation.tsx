import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFriendFavorite } from '@/api/friend';
import { useDispatch } from 'react-redux';
import { FriendDetailsResponseType } from '@repo/validation';
import toast from 'react-hot-toast';

export const useCreateFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFriendFavorite,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ['userDetails', userId] });
      const previousData = queryClient.getQueryData<FriendDetailsResponseType>([
        'userDetails',
        userId,
      ]);
      if (previousData) {
        queryClient.setQueryData(['userDetails', userId], {
          ...previousData,
          isFavorite: true, // 즉시 UI 반영
        });
      }
      return { previousData };
    },
    onSuccess: (userId: number) => {
      toast.success('success add favorite');
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
    onError: (error, userId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['userDetails', userId], context.previousData);
      }
      toast.error('failed to add favorite');
      console.error('Error adding favorite:', error);
    },
    onSettled: (userId) => {
      // 서버 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
    },
  });
};
