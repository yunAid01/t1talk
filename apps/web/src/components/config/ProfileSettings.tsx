import { useEffect, useState } from 'react';
import ConfigProfileField from './ConfigProfileField';
import ConfigProfilePicture from './ConfigProfilePicture';
import { openModal } from '@/store/features/modalSlice';
import { useDispatch } from 'react-redux';

interface ProfileSettingsProps {
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

export default function ProfileSettings({
  myProfileData,
}: ProfileSettingsProps) {
  const dispatch = useDispatch();
  // profile data update
  const [statusMessage, setStatusMessage] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (myProfileData) {
      setStatusMessage(myProfileData.statusMessage || '');
      setEmail(myProfileData.email || '');
      setNickname(myProfileData.nickname || '');
    }
  }, [myProfileData]);

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

      {/* Profile Picture */}
      <ConfigProfilePicture
        profileImageUrl={myProfileData.profileImageUrl || ''}
        nickname={myProfileData.nickname || ''}
        email={myProfileData.email || ''}
      />

      {/* Profile Fields */}
      <div className="space-y-4">
        {myProfileData && (
          <form onSubmit={handleUpdateUser}>
            <div>
              <ConfigProfileField
                value={nickname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNickname(e.target.value)
                }
                name="nickname"
                placeholder="Nickname"
                labelText="Nickname"
                inputType="text"
              />
              <ConfigProfileField
                value={statusMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setStatusMessage(e.target.value)
                }
                name="statusMessage"
                placeholder="make id cool!"
                labelText="Status Message"
                inputType="text"
              />
              <ConfigProfileField
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
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
  );
}
