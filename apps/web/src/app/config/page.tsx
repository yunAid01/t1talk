'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import { User, Bell, Lock, Palette, LogOut, Trash2 } from 'lucide-react';
import ConfigAppearance from '@/components/config/ConfigAppearance';
import ConfigPrivacy from '@/components/config/ConfigPrivacy';
import { openModal } from '@/store/features/modalSlice';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/api/user';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import { QUERY_KEYS } from '@/constants/queryKeys';
import MainHeader from '@/components/common/MainHeader';
import ConfigNotifications from '@/components/config/ConfigNotifications';
import ProfileSettings from '@/components/config/ProfileSettings';

export default function ConfigPage() {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const {
    data: myProfileData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.MYPROFILE.DETAILS,
    queryFn: getMyProfile,
  });

  type TabType = 'profile' | 'notifications' | 'privacy' | 'appearance';
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const handleLogout = () => {
    dispatch(openModal({ modalType: 'LOGOUT_CONFIRM' }));
  };

  const handleDeleteUser = () => {
    dispatch(
      openModal({
        modalType: 'USER_DELETE',
        modalProps: { userId: currentUser?.id },
      }),
    );
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (isLoading) {
    return <Loading message="Loading settings..." fullScreen={true} />;
  }

  if (isError) {
    return (
      <Error
        error={error}
        onRetry={() => window.location.reload()}
        message="Failed to load config page."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <MainHeader title="Settings" text="Manage your account settings" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
                >
                  <Trash2 size={20} />
                  <span className="font-medium">Delete Account</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
              {activeTab === 'profile' && myProfileData && (
                <ProfileSettings myProfileData={myProfileData} />
              )}

              {activeTab === 'notifications' && myProfileData && (
                <ConfigNotifications myProfileData={myProfileData} />
              )}

              {activeTab === 'privacy' && myProfileData && (
                <ConfigPrivacy myProfileData={myProfileData} />
              )}

              {activeTab === 'appearance' && <ConfigAppearance />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
