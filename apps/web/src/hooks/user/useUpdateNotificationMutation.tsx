import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNotificationOn } from '@/api/user';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { getUserProfileResponseType } from '@repo/validation';
import { toast } from 'react-hot-toast';

export const useUpdateNotificationOnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: 'message' | 'friendRequest' | 'groupInvitation') =>
      updateNotificationOn(type),
    onMutate: async (type) => {
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
            ...(type === 'message'
              ? { isMessageNotificationOn: !old.isMessageNotificationOn }
              : type === 'friendRequest'
                ? {
                    isFriendNotificationOn: !old.isFriendNotificationOn,
                  }
                : {
                    isGroupInvitationNotificationOn:
                      !old.isGroupInvitationNotificationOn,
                  }),
          };
        },
      );
      return { previousProfile };
    },
    onSuccess: () => {
      toast.success(`notification updated successfully`);
    },
    onError: (_error, types, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          QUERY_KEYS.MYPROFILE.DETAILS,
          context.previousProfile,
        );
      }
      toast.error(`Failed to update ${types} notification`);
    },
  });
};
