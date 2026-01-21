import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, update } from 'firebase/database';
import { db } from '../config/firebase';
import Modal from './Modal';

const ProfileCard = ({ healthData, bmi, onUpdate }) => {
  const { currentUser, userInfo, setUserInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstname: userInfo?.firstname || '',
    lastname: userInfo?.lastname || '',
    email: currentUser?.email || '',
  });

  const handleSaveProfile = async () => {
    try {
      await update(ref(db, `UsersAuthList/${currentUser.uid}`), {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
      });

      const updatedInfo = {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
      };
      sessionStorage.setItem('user-info', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      setIsEditModalOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + error.message);
    }
  };

  const userName = userInfo ? `${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim() : 'User';
  const firstName = userInfo?.firstname || 'there';
  const userEmail = currentUser?.email || '';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <div className="card bg-gradient-to-br from-primary-500 via-primary-400 to-blue-500 text-white mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 border-4 border-white border-opacity-30 flex items-center justify-center shadow-lg">
              <img
                src={currentUser?.photoURL || "https://img.icons8.com/ios-filled/100/FFFFFF/user-female-circle.png"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://img.icons8.com/ios-filled/100/FFFFFF/user-female-circle.png';
                }}
              />
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 bg-white text-primary-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              title="Edit Profile"
            >
              <i className="fas fa-edit text-xs"></i>
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-white text-opacity-90 mb-1">{getGreeting()},</p>
            <h2 className="text-3xl font-bold mb-2">{userName || 'User'}</h2>
            <p className="text-white text-opacity-80 mb-4">{userEmail}</p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
              {healthData.weight && (
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <div className="text-xs text-white text-opacity-80">Weight</div>
                  <div className="text-lg font-bold">{healthData.weight} kg</div>
                </div>
              )}
              {bmi.value !== '--' && (
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <div className="text-xs text-white text-opacity-80">BMI</div>
                  <div className="text-lg font-bold">{bmi.value}</div>
                </div>
              )}
              {healthData.steps && (
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <div className="text-xs text-white text-opacity-80">Today's Steps</div>
                  <div className="text-lg font-bold">{healthData.steps.toLocaleString()}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition-all backdrop-blur-sm"
              >
                <i className="fas fa-user-edit mr-2"></i>Edit Profile
              </button>
              <button
                onClick={() => navigate('/health-input')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-2 px-4 rounded-lg transition-all backdrop-blur-sm"
              >
                <i className="fas fa-plus-circle mr-2"></i>Add Data
              </button>
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to log out?')) {
                    try {
                      await logout();
                      navigate('/login');
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }
                }}
                className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold py-2 px-4 rounded-lg transition-all backdrop-blur-sm"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProfile();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={editForm.firstname}
              onChange={(e) => setEditForm({ ...editForm, firstname: e.target.value })}
              placeholder="Enter first name"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={editForm.lastname}
              onChange={(e) => setEditForm({ ...editForm, lastname: e.target.value })}
              placeholder="Enter last name"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              disabled
              className="input-field bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileCard;
