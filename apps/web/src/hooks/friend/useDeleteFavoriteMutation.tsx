import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFriendFavorite } from '@/api/friend';
import { FriendDetailsResponseType } from '@repo/validation';
import toast from 'react-hot-toast';

export const useDeleteFavoriteMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => deleteFriendFavorite(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userDetails', userId] });
      const previousData = queryClient.getQueryData<FriendDetailsResponseType>([
        'userDetails',
        userId,
      ]);
      queryClient.setQueryData<FriendDetailsResponseType>(
        ['userDetails', userId],
        (old) => {
          if (!old) return undefined;
          return { ...old, isFavorite: false };
        },
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success('즐겨찾기에서 제거되었습니다');
      queryClient.invalidateQueries({ queryKey: ['userDetails', userId] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
    onError: (error, _variables, context) => {
      toast.error('즐겨찾기 제거에 실패했습니다');
      if (context?.previousData) {
        queryClient.setQueryData(['userDetails', userId], context.previousData);
      }
    },
  });
};
