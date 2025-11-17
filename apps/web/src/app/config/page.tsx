'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  LogOut,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import ConfigAppearance from '@/components/config/ConfigAppearance';
import ConfigPrivacy from '@/components/config/ConfigPrivacy';
import ConfigProfileField from '@/components/config/ConfigProfileField';
import ConfigNotifications from '@/components/config/ConfigNotifications';
import ConfigProfilePicture from '@/components/config/ConfigProfilePicture';
import ConfigHeader from '@/components/config/ConfigHeader';
import { openModal } from '@/store/features/modalSlice';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/api/user';
import Loading from '@/components/common/Loding';
import Error from '@/components/common/Error';
import { useUpdateNotificationOnMutation } from '@/hooks/user/useUpdateNotificationMutation';
import { useUpdatePrivacyMutation } from '@/hooks/user/useUpdatePrivacyMutation';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { NotificationType } from 'node_modules/@repo/validation/dist/user';

export default function ConfigPage() {
  const { mutate: updateNotificationMutate } =
    useUpdateNotificationOnMutation();
  const { mutate: updatePrivacyMutate } = useUpdatePrivacyMutation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  // profile data update
  const [statusMessage, setStatusMessage] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  // notifications
  const [isMessageNotificationOn, setIsMessageNotificationOn] = useState(false);
  const [isFriendNotificationOn, setIsFriendNotificationOn] = useState(false);
  const [isGroupInvitationNotificationOn, setIsGroupInvitationNotificationOn] =
    useState(false);

  // security
  const [isPrivate, setIsPrivate] = useState(false);

  const {
    data: myProfileData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.MYPROFILE.DETAILS,
    queryFn: getMyProfile,
  });

  useEffect(() => {
    if (myProfileData) {
      setStatusMessage(myProfileData.statusMessage || '');
      setEmail(myProfileData.email || '');
      setNickname(myProfileData.nickname || '');
      setIsMessageNotificationOn(
        myProfileData.isMessageNotificationOn || false,
      );
      setIsFriendNotificationOn(myProfileData.isFriendNotificationOn || false);
      setIsGroupInvitationNotificationOn(
        myProfileData.isGroupInvitationNotificationOn || false,
      );
      setIsPrivate(myProfileData.isPrivate || false);
    }
  }, [myProfileData]);

  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'privacy' | 'appearance'
  >('profile');

  const handleLogout = () => {
    dispatch(openModal({ modalType: 'LOGOUT_CONFIRM' }));
  };

  const handleNotificationChange = (type: NotificationType) => {
    updateNotificationMutate(type);
  };

  const handlePrivacyToggle = () => {
    updatePrivacyMutate();
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      openModal({
        modalType: 'USER_UPDATE',
        modalProps: {
          updateData: {
            nickname,
            statusMessage,
            email,
          },
        },
      }),
    );
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
      <ConfigHeader />

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
                    onClick={() => setActiveTab(tab.id as any)}
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
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Profile Settings
                  </h2>

                  {/* Profile Picture */}
                  <ConfigProfilePicture
                    profileImageUrl={currentUser?.profileImageUrl || ''}
                    nickname={currentUser?.nickname || ''}
                    email={currentUser?.email || ''}
                  />

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    {currentUser && (
                      <form onSubmit={handleUpdateUser}>
                        <div>
                          <ConfigProfileField
                            value={nickname}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setNickname(e.target.value)}
                            name="nickname"
                            placeholder="Nickname"
                            labelText="Nickname"
                            inputType="text"
                          />
                          <ConfigProfileField
                            value={statusMessage}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setStatusMessage(e.target.value)}
                            name="statusMessage"
                            placeholder="make id cool!"
                            labelText="Status Message"
                            inputType="text"
                          />
                          <ConfigProfileField
                            value={email}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setEmail(e.target.value)}
                            name="email"
                            placeholder="Email"
                            labelText="Email"
                            inputType="email"
                          />
                        </div>
                        <button className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl">
                          Save Changes
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    <ConfigNotifications
                      label="New Messages"
                      desc="Get notified when you receive new messages"
                      checked={isMessageNotificationOn}
                      onToggle={() => handleNotificationChange('message')}
                      icon={MessageSquare}
                    />
                    <ConfigNotifications
                      label="Friend Requests"
                      desc="Get notified about friend requests"
                      checked={isFriendNotificationOn}
                      onToggle={() => handleNotificationChange('friendRequest')}
                      icon={User}
                    />
                    <ConfigNotifications
                      label="Group Invites"
                      desc="Get notified when invited to groups"
                      checked={isGroupInvitationNotificationOn}
                      icon={Globe}
                      onToggle={() =>
                        handleNotificationChange('groupInvitation')
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <ConfigPrivacy
                  onToggle={handlePrivacyToggle}
                  checked={isPrivate}
                />
              )}

              {activeTab === 'appearance' && <ConfigAppearance />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
