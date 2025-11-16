'use client';

import { useState } from 'react';
import { Lock, Shield } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/features/modalSlice';

interface ConfigPrivacyProps {
  checked: boolean;
  onToggle: () => void;
}
export default function ConfigPrivacy({
  checked,
  onToggle,
}: ConfigPrivacyProps) {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
        <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="text-red-500" size={20} />
            <h3 className="font-medium text-white">
              do you want to user profile privacy?
            </h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              onChange={onToggle}
              className="sr-only peer"
              checked={checked}
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

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
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
