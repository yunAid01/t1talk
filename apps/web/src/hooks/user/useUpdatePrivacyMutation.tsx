import { updatePrivacy } from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getUserProfileResponseType } from '@repo/validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useUpdatePrivacyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrivacy,
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MYPROFILE.DETAILS,
      });
      const previousProfile =
        queryClient.getQueryData<getUserProfileResponseType>(
          QUERY_KEYS.MYPROFILE.DETAILS,
        );
      queryClient.setQueryData(
        QUERY_KEYS.MYPROFILE.DETAILS,
        (old: getUserProfileResponseType) => {
          if (!old) return undefined;
          return {
            ...old,
            isPrivate: !old.isPrivate,
          };
        },
      );
      return { previousProfile };
    },
    onSuccess: (data) => {
      toast.success(
        `Privacy setting updated successfully ${data.isPrivate ? 'to Private' : 'to Public'}`,
      );
    },
    onError: (error_, var_, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          QUERY_KEYS.MYPROFILE.DETAILS,
          context.previousProfile,
        );
      }
      toast.error('Failed to update privacy setting');
    },
  });
};
