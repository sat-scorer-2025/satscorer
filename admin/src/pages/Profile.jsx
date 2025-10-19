import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ProfileEditDialog from '../components/profile/ProfileEditDialog';
import ProfileAvatar from '../components/profile/ProfileAvatar';
import { UserIcon } from '../components/profile/Icons';

const Profile = () => {
  const { user, token } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    profilePhoto: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        profilePhoto: user.profilePhoto || '',
      });
    }
  }, [user]);

  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h1>
            <button
              onClick={handleEditOpen}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          </div>
          <div className="flex items-center mb-8">
            <ProfileAvatar src={profileData.profilePhoto} alt={profileData.name} size="large" />
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-800">{profileData.name}</h2>
              <p className="text-gray-600 text-sm">{profileData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start bg-gray-100 p-4 rounded-md border border-gray-200 shadow-sm">
              <UserIcon className="w-5 h-5 text-blue-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Phone</p>
                <p className="text-gray-800 font-medium">{profileData.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-100 p-4 rounded-md border border-gray-200 shadow-sm">
              <UserIcon className="w-5 h-5 text-blue-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-800 font-medium">{profileData.address || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-start bg-gray-100 p-4 rounded-md border border-gray-200 shadow-sm">
              <UserIcon className="w-5 h-5 text-blue-600 mr-3 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-700">Date of Birth</p>
                <p className="text-gray-800 font-medium">{profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditOpen && (
        <ProfileEditDialog
          isOpen={isEditOpen}
          onClose={handleEditClose}
          profileData={profileData}
          setProfileData={setProfileData}
          token={token}
        />
      )}
    </div>
  );
};

export default Profile;