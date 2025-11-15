import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFriendFavorite } from '@/api/friend';
import { FriendDetailsResponseType } from '@repo/validation';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useDeleteFavoriteMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFriendFavorite(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['userDetails', userId] });
      const previousData = queryClient.getQueryData<FriendDetailsResponseType>(
        QUERY_KEYS.FRIENDS.DETAILS(userId),
      );
      queryClient.setQueryData<FriendDetailsResponseType>(
        QUERY_KEYS.FRIENDS.DETAILS(userId),
        (old) => {
          if (!old) return undefined;
          return { ...old, isFavorite: false };
        },
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success('즐겨찾기에서 제거되었습니다');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIENDS.DETAILS(userId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST });
    },
    onError: (error, _variables, context) => {
      toast.error('즐겨찾기 제거에 실패했습니다');
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.FRIENDS.DETAILS(userId),
          context.previousData,
        );
      }
    },
  });
};
