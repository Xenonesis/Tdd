'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import ProtectedRoute from '@/lib/auth/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/Button';
import { Badge, RoleBadge } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Bell, 
  Moon, 
  Lock, 
  LogOut, 
  Camera,
  Save,
  Check
} from 'lucide-react';

function ProfileContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: 'Passionate learner exploring new technologies and methodologies.',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://example.com',
  });

  const [notifications, setNotifications] = useState({
    emailCourseUpdates: true,
    emailProgressReminders: true,
    emailCertificates: true,
    emailNewsletter: false,
    pushNotifications: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-5xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="card p-6 mb-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{user?.email}</p>
              <RoleBadge role={user?.role || 'STUDENT'} />
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                    ${activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h3>
                <div className="grid gap-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Last Name"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4" />}
                    disabled
                    helperText="Email cannot be changed"
                  />
                  <Textarea
                    label="Bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    helperText="A brief description about yourself"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                    <Input
                      label="Location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost">Cancel</Button>
                  <Button 
                    onClick={handleSave} 
                    loading={saving}
                    icon={saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  >
                    {saved ? 'Saved!' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Change Password
                  </h3>
                  <div className="grid gap-4 max-w-md">
                    <Input
                      label="Current Password"
                      type="password"
                      leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <Input
                      label="New Password"
                      type="password"
                      leftIcon={<Lock className="w-4 h-4" />}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      leftIcon={<Lock className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="card p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="card p-6 sm:p-8 border-red-200 dark:border-red-900">
                  <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                    Danger Zone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="danger">Delete Account</Button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      {[
                        { key: 'emailCourseUpdates', label: 'Course Updates', desc: 'Get notified when courses are updated' },
                        { key: 'emailProgressReminders', label: 'Progress Reminders', desc: 'Weekly reminders about your learning progress' },
                        { key: 'emailCertificates', label: 'Certificates', desc: 'Get notified when you earn new certificates' },
                        { key: 'emailNewsletter', label: 'Newsletter', desc: 'Receive our monthly newsletter' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={(notifications as any)[item.key]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Push Notifications</h4>
                    <label className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Enable Push Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications in your browser</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button onClick={handleSave} loading={saving}>Save Preferences</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
