'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Edit2, Save, AlertCircle } from 'lucide-react';
import { userAPI } from '@/src/lib/api';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
      setFullName(response.data.full_name || '');
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    try {
      await userAPI.updateProfile({ full_name: fullName });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="card space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-900 to-blue-900 rounded-full flex items-center justify-center">
              <User className="text-white" size={48} />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold">{user?.full_name || 'User'}</h2>
              <p className="text-gray-600">@{user?.username}</p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
              {success}
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field pl-10 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="input-field pl-10 bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  className={`input-field pl-10 ${!isEditing && 'bg-gray-50'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Member Since
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  value={new Date(user?.created_at).toLocaleDateString()}
                  disabled
                  className="input-field pl-10 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(user?.full_name || '');
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleUpdate} className="btn-primary flex items-center space-x-2">
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}