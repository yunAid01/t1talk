import apiClient from './client';
import type {
  getUserProfileResponseType,
  NotificationType,
  NotificationUpdateResponseType,
  PrivacyUpdateResponseType,
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

export const updateNotificationOn = async (
  type: NotificationType,
): Promise<NotificationUpdateResponseType> => {
  const response: NotificationUpdateResponseType = await apiClient.patch(
    '/user/notification',
    {
      type,
    },
  );
  return response;
};

export const updatePrivacy = async (): Promise<PrivacyUpdateResponseType> => {
  const response: PrivacyUpdateResponseType =
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
