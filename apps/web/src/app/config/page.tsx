'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/features/authSlice';
import Image from 'next/image';
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  LogOut,
  Camera,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConfigPage() {
  const currentUser = useSelector(selectCurrentUser);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'privacy' | 'appearance'
  >('profile');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-sm border-b border-red-900/30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
            Settings (TODO)
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

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
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-800">
                        <Image
                          src={
                            currentUser?.profileImageUrl ||
                            '/images/default-profileImage.jpg'
                          }
                          alt={currentUser?.nickname || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg">
                        <Camera size={16} className="text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {currentUser?.nickname}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nickname
                      </label>
                      <input
                        type="text"
                        defaultValue={currentUser?.nickname}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Status Message
                      </label>
                      <input
                        type="text"
                        defaultValue={currentUser?.statusMessage || ''}
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                          size={20}
                        />
                        <input
                          type="email"
                          defaultValue={currentUser?.email}
                          className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                        />
                      </div>
                    </div>

                    <button className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Notification Settings
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        label: 'New Messages',
                        desc: 'Get notified when you receive new messages',
                        icon: MessageSquare,
                      },
                      {
                        label: 'Friend Requests',
                        desc: 'Get notified about friend requests',
                        icon: User,
                      },
                      {
                        label: 'Group Invites',
                        desc: 'Get notified when invited to groups',
                        icon: Globe,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="text-red-500" size={20} />
                            <div>
                              <p className="font-medium text-white">
                                {item.label}
                              </p>
                              <p className="text-sm text-gray-400">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              defaultChecked
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Privacy & Security
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="text-red-500" size={20} />
                        <h3 className="font-medium text-white">
                          Who can add me as a friend?
                        </h3>
                      </div>
                      <select className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600">
                        <option>Everyone</option>
                        <option>Friends of Friends</option>
                        <option>Nobody</option>
                      </select>
                    </div>

                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Lock className="text-red-500" size={20} />
                        <h3 className="font-medium text-white">
                          Change Password
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                        />
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Appearance
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <h3 className="font-medium text-white mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <button className="p-4 bg-gradient-to-br from-red-600 to-red-900 rounded-lg border-2 border-red-500 hover:scale-105 transition-transform">
                          <div className="text-white font-semibold">T1 Red</div>
                          <div className="text-xs text-red-200 mt-1">
                            Current
                          </div>
                        </button>
                        <button className="p-4 bg-gradient-to-br from-gray-600 to-gray-900 rounded-lg border-2 border-gray-700 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
                          <div className="text-white font-semibold">Dark</div>
                          <div className="text-xs text-gray-400 mt-1">
                            Coming Soon
                          </div>
                        </button>
                        <button className="p-4 bg-gradient-to-br from-blue-600 to-blue-900 rounded-lg border-2 border-blue-700 hover:scale-105 transition-transform opacity-50 cursor-not-allowed">
                          <div className="text-white font-semibold">Blue</div>
                          <div className="text-xs text-blue-200 mt-1">
                            Coming Soon
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
