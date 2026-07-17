import React, { useState } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FileImageUpload } from '../../components/FileImageUpload/FileImageUpload';
import { useApp } from '../../context/AppContext';
import { updateProfile, changePassword } from '../../services/profileService';
export function ProfilePage() {
  const { currentUser, addToast, updateCurrentUser } = useApp();
  const [profile, setProfile] = useState({
    fullName: currentUser?.fullName ?? '',
    username: currentUser?.username ?? '',
    email: currentUser?.email ?? '',
    image: currentUser?.image || ''
  });
  const [savedProfile, setSavedProfile] = useState(profile);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [pwd, setPwd] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [pwdErrors, setPwdErrors] = useState<Record<string, string>>({});
  const handleSaveProfile = async () => {
    const e: Record<string, string> = {};
    if (!profile.fullName.trim()) e.fullName = 'Full name is required';
    if (!profile.username.trim()) e.username = 'Username is required';
    if (!profile.email.trim()) e.email = 'Email is required';else
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
    e.email = 'Invalid email format';
    setProfileErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      await updateProfile(profile);
      setSavedProfile(profile);
      updateCurrentUser({
        fullName: profile.fullName,
        username: profile.username,
        email: profile.email,
        image: profile.image || null
      });
      addToast('Profile updated', 'success');
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'Failed to update profile',
        'error'
      );
    }
  };
  const handleCancelProfile = () => {
    setProfile(savedProfile);
    setProfileErrors({});
  };
  const handleChangePassword = async () => {
    const e: Record<string, string> = {};
    if (!pwd.currentPassword) e.currentPassword = 'Current password is required';
    if (!pwd.newPassword) e.newPassword = 'New password is required';else
    if (pwd.newPassword.length < 8)
    e.newPassword = 'Password must be at least 8 characters';
    if (pwd.newPassword !== pwd.confirmNewPassword)
    e.confirmNewPassword = 'Passwords do not match';
    setPwdErrors(e);
    if (Object.keys(e).length > 0) return;
    try {
      await changePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword
      });
      setPwd({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      addToast('Password updated', 'success');
    } catch (err) {
      addToast(
        err instanceof Error ? err.message : 'Failed to change password',
        'error'
      );
    }
  };
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal info and password.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h2>
        <div className="space-y-4">
          <FileImageUpload
            label="Profile Photo"
            value={profile.image}
            onChange={(file) => {
              if (!file)
              setProfile({
                ...profile,
                image: ''
              });else

              setProfile({
                ...profile,
                image: URL.createObjectURL(file)
              });
            }} />
          

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              value={profile.fullName}
              onChange={(e) =>
              setProfile({
                ...profile,
                fullName: e.target.value
              })
              } />
            
            {profileErrors.fullName &&
            <p className="mt-1 text-xs text-rose-600">
                {profileErrors.fullName}
              </p>
            }
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                value={profile.username}
                onChange={(e) =>
                setProfile({
                  ...profile,
                  username: e.target.value
                })
                } />
              
              {profileErrors.username &&
              <p className="mt-1 text-xs text-rose-600">
                  {profileErrors.username}
                </p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value
                })
                } />
              
              {profileErrors.email &&
              <p className="mt-1 text-xs text-rose-600">
                  {profileErrors.email}
                </p>
              }
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
            <Button variant="secondary" onClick={handleCancelProfile}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <Input
              type="password"
              value={pwd.currentPassword}
              onChange={(e) =>
              setPwd({
                ...pwd,
                currentPassword: e.target.value
              })
              } />
            
            {pwdErrors.currentPassword &&
            <p className="mt-1 text-xs text-rose-600">
                {pwdErrors.currentPassword}
              </p>
            }
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={pwd.newPassword}
                onChange={(e) =>
                setPwd({
                  ...pwd,
                  newPassword: e.target.value
                })
                } />
              
              {pwdErrors.newPassword &&
              <p className="mt-1 text-xs text-rose-600">
                  {pwdErrors.newPassword}
                </p>
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={pwd.confirmNewPassword}
                onChange={(e) =>
                setPwd({
                  ...pwd,
                  confirmNewPassword: e.target.value
                })
                } />
              
              {pwdErrors.confirmNewPassword &&
              <p className="mt-1 text-xs text-rose-600">
                  {pwdErrors.confirmNewPassword}
                </p>
              }
            </div>
          </div>
          <div className="pt-4 flex justify-end border-t border-gray-100">
            <Button onClick={handleChangePassword}>
              <KeyRound className="w-4 h-4 mr-2" />
              Update Password
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}