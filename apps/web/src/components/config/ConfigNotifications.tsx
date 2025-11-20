'use client';

import { Globe, MessageSquare, User } from 'lucide-react';

import ConfigNotificationToggleInput from './ConfigNotificationToggleInput';
import { useEffect, useState } from 'react';
import { NotificationType } from '@repo/validation';
import { useUpdateNotificationOnMutation } from '@/hooks/user/useUpdateNotificationMutation';

interface ConfigNotificationsProps {
  myProfileData: {
    email: string;
    nickname: string;
    createdAt: Date;
    statusMessage: string | null;
    profileImageUrl: string | null;
    backgroundImageUrl: string | null;
    isMessageNotificationOn: boolean;
    isFriendNotificationOn: boolean;
    isGroupInvitationNotificationOn: boolean;
    isPrivate: boolean;
  };
}
export default function ConfigNotifications({
  myProfileData,
}: ConfigNotificationsProps) {
  // notifications
  const [isMessageNotificationOn, setIsMessageNotificationOn] = useState(false);
  const [isFriendNotificationOn, setIsFriendNotificationOn] = useState(false);
  const [isGroupInvitationNotificationOn, setIsGroupInvitationNotificationOn] =
    useState(false);

  useEffect(() => {
    setIsMessageNotificationOn(myProfileData.isMessageNotificationOn || false);
    setIsFriendNotificationOn(myProfileData.isFriendNotificationOn || false);
    setIsGroupInvitationNotificationOn(
      myProfileData.isGroupInvitationNotificationOn || false,
    );
  }, [myProfileData]);

  const { mutate: updateNotificationMutate } =
    useUpdateNotificationOnMutation();
  const handleNotificationChange = (type: NotificationType) => {
    updateNotificationMutate(type);
  };

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">
          Notification Settings
        </h2>

        <div className="space-y-4">
          <ConfigNotificationToggleInput
            label="New Messages"
            desc="Get notified when you receive new messages"
            checked={isMessageNotificationOn}
            onToggle={() => handleNotificationChange('message')}
            icon={MessageSquare}
          />
          <ConfigNotificationToggleInput
            label="Friend Requests"
            desc="Get notified about friend requests"
            checked={isFriendNotificationOn}
            onToggle={() => handleNotificationChange('friendRequest')}
            icon={User}
          />
          <ConfigNotificationToggleInput
            label="Group Invites"
            desc="Get notified when invited to groups"
            checked={isGroupInvitationNotificationOn}
            icon={Globe}
            onToggle={() => handleNotificationChange('groupInvitation')}
          />
        </div>
      </div>
    </>
  );
}
