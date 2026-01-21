import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import StepTracker from '../components/StepTracker';

const Today = () => {
  const { currentUser, userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({});
  const [yesterdayData, setYesterdayData] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayId = today.getTime();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayId = yesterday.getTime();

    const todayRef = ref(db, `HealthData/${currentUser.uid}/${todayId}`);
    const yesterdayRef = ref(db, `HealthData/${currentUser.uid}/${yesterdayId}`);

    const unsubscribeToday = onValue(todayRef, (snapshot) => {
      setHealthData(snapshot.val() || {});
    });

    const unsubscribeYesterday = onValue(yesterdayRef, (snapshot) => {
      setYesterdayData(snapshot.val() || {});
    });

    return () => {
      unsubscribeToday();
      unsubscribeYesterday();
    };
  }, [currentUser]);

  const calculateBMI = () => {
    if (healthData.weight && healthData.height) {
      const heightInMeters = healthData.height / 100;
      const bmi = healthData.weight / (heightInMeters * heightInMeters);
      return { value: bmi.toFixed(2), status: getBMIStatus(bmi) };
    }
    return { value: '--', status: 'No data available' };
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obesity';
  };

  const getBMIStatusColor = (status) => {
    switch (status) {
      case 'Normal weight':
        return 'bg-green-100 text-green-800';
      case 'Underweight':
        return 'bg-blue-100 text-blue-800';
      case 'Overweight':
        return 'bg-yellow-100 text-yellow-800';
      case 'Obesity':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return '--';
    return `${value} ${unit}`;
  };

  const formatExercise = (exercise) => {
    if (!exercise) return 'No exercise scheduled';
    return `${exercise.type || 'Exercise'}: ${exercise.date || ''}, ${exercise.time || ''}`;
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const userName = userInfo ? `${userInfo.firstname || ''} ${userInfo.lastname || ''}`.trim() : 'User';
  const firstName = userInfo?.firstname || 'there';
  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        {/* Profile Card */}
        <div className="card mx-4 mt-4 mb-8 bg-gradient-to-br from-blue-200 via-primary-300 to-primary-400">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex flex-col items-center">
              <img
                src="https://img.icons8.com/ios-filled/100/000000/user-female-circle.png"
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-medium"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=User';
                }}
              />
              <p className="mt-2 text-white font-semibold">Your Profile</p>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{userName}</h2>
              <p className="text-gray-700 mb-4">Welcome back, <strong>{firstName}</strong>! Let's make today count.</p>
              <div className="flex gap-3 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/health-input')}
                  className="btn-primary"
                >
                  Edit Health Data
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="w-full md:w-auto">
              <StepTracker />
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="px-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Today's Health Overview
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Weight */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-weight text-primary-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Weight</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.weight, 'kg')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.weight, 'kg')}</p>
            </div>

            {/* Calories */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-fire text-orange-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Food Calories</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.calories, 'kcal')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.calories, 'kcal')}</p>
            </div>

            {/* Sleep */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-moon text-indigo-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Sleep</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.sleep, 'hrs')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.sleep, 'hrs')}</p>
            </div>

            {/* Water */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-tint text-blue-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Water</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.water, 'L')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.water, 'L')}</p>
            </div>

            {/* Burned Calories */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-fire text-red-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Burned Calories</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.BurCal, 'kcal')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.BurCal, 'kcal')}</p>
            </div>

            {/* Height */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-ruler-vertical text-yellow-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Height</h5>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {formatValue(healthData.height, 'cm')}
              </h4>
              <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.height, 'cm')}</p>
            </div>

            {/* Exercise */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-running text-green-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">Exercise</h5>
              </div>
              <h5 className="text-lg font-bold text-gray-900 mb-1">
                {formatExercise(healthData.exercise)}
              </h5>
            </div>

            {/* BMI */}
            <div className="card cursor-pointer hover:shadow-large transition-all" onClick={() => navigate('/health-input')}>
              <div className="flex items-center gap-3 mb-4">
                <i className="fas fa-scale-balanced text-purple-500 text-2xl"></i>
                <h5 className="text-lg font-semibold text-gray-800">BMI</h5>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-2xl font-bold text-gray-900">{bmi.value}</h4>
                <span className={`px-4 py-2 rounded-xl font-semibold text-sm ${getBMIStatusColor(bmi.status)}`}>
                  {bmi.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;
