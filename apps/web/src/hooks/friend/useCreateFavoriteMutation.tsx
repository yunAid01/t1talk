import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFriendFavorite } from '@/api/friend';
import { FriendDetailsResponseType } from '@repo/validation';
import toast from 'react-hot-toast';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useCreateFavoriteMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => createFriendFavorite(userId),
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
          return { ...old, isFavorite: true };
        },
      );
      return { previousData };
    },
    onSuccess: () => {
      toast.success('즐겨찾기에 추가되었습니다');
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FRIENDS.DETAILS(userId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FRIENDS.LIST }); // 친구 목록도 갱신
    },
    onError: (error, _variables, context) => {
      toast.error('즐겨찾기 추가에 실패했습니다');
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.FRIENDS.DETAILS(userId),
          context.previousData,
        );
      }
    },
  });
};
