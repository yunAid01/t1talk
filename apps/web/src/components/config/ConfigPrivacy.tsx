'use client';

import { useEffect, useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';
import { useUpdatePrivacyMutation } from '@/hooks/user/useUpdatePrivacyMutation';

interface ConfigPrivacyProps {
  myProfileData: {
    email: string;
    nickname: string;
    createdAt: string | Date;
    statusMessage: string | null;
    profileImageUrl: string | null;
    backgroundImageUrl: string | null;
    isMessageNotificationOn: boolean;
    isFriendNotificationOn: boolean;
    isGroupInvitationNotificationOn: boolean;
    isPrivate: boolean;
  };
}
export default function ConfigPrivacy({ myProfileData }: ConfigPrivacyProps) {
  const dispatch = useDispatch();
  // security
  const [isPrivate, setIsPrivate] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    setIsPrivate(myProfileData.isPrivate || false);
  }, [myProfileData]);

  const { mutate: updatePrivacyMutate } = useUpdatePrivacyMutation();
  const handlePrivacyToggle = () => {
    updatePrivacyMutate();
  };

  const updatePassword = () => {
    dispatch(
      openModal({
        modalType: 'PASSWORD_UPDATE',
        modalProps: { currentPassword, newPassword },
      }),
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
      <div className="space-y-4">
        {/* Privacy Setting */}
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-red-500" size={20} />
            <h3 className="font-medium text-white">
              Do you want to make your user profile private?
              <br />
              other users can't add you as a friend.
            </h3>
            <h3 className="font-medium text-white"></h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              onChange={handlePrivacyToggle}
              className="sr-only peer"
              checked={isPrivate}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        {/* password update */}
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="text-red-500" size={20} />
            <h3 className="font-medium text-white">Change Password</h3>
          </div>
          <div className="space-y-3">
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Current Password"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
            />
            <button
              disabled={
                !currentPassword ||
                !newPassword ||
                currentPassword === newPassword
              }
              onClick={updatePassword}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Update Password
            </button>
            {currentPassword &&
              newPassword &&
              currentPassword === newPassword && (
                <p className="text-sm text-yellow-400">
                  New password must be different from current password.
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
