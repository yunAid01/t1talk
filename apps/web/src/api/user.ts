import apiClient from './client';
import type {
  getUserProfileResponseType,
  updateUserInputType,
  updateUserResponseType,
} from '@repo/validation';

export const getMyProfile = async (): Promise<getUserProfileResponseType> => {
  const response: getUserProfileResponseType = await apiClient.get('/user/');
  return response;
};

export const updateUser = async (
  data: updateUserInputType,
): Promise<updateUserResponseType> => {
  const response: updateUserResponseType = await apiClient.patch(
    `/user/`,
    data,
  );
  return response;
};

export interface NotificationUpdateResponse {
  message: string;
  isMessageNotificationOn?: boolean;
  isFriendNotificationOn?: boolean;
  isGroupInvitationNotificationOn?: boolean;
}
export const updateNotificationOn = async (
  type: 'message' | 'friendRequest' | 'groupInvitation',
): Promise<NotificationUpdateResponse> => {
  const response: NotificationUpdateResponse = await apiClient.patch(
    '/user/notification',
    {
      type,
    },
  );
  return response;
};

export interface PrivacyUpdateResponse {
  message: string;
  isPrivate: boolean;
}
export const updatePrivacy = async (): Promise<PrivacyUpdateResponse> => {
  const response: PrivacyUpdateResponse =
    await apiClient.patch('/user/privacy');
  return response;
};

export interface PasswordUpdateResponse {
  message: string;
}
export const updatePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<PasswordUpdateResponse> => {
  const response: PasswordUpdateResponse = await apiClient.patch(
    '/user/password',
    { currentPassword, newPassword },
  );
  return response;
};

export const deleteMyAccount = async (id: number): Promise<void> => {
  await apiClient.delete(`/user/${id}`);
};
