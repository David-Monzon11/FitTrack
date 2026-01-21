import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import StepTracker from '../components/StepTracker';
import ProfileCard from '../components/ProfileCard';
import QuickStats from '../components/QuickStats';

const Today = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({});
  const [yesterdayData, setYesterdayData] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [currentUser, refreshKey]);

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

  const formatValue = (value, unit) => {
    if (value === undefined || value === null) return '--';
    return `${value} ${unit}`;
  };

  const formatExercise = (exercise) => {
    if (!exercise) return 'No exercise scheduled';
    return `${exercise.type || 'Exercise'}: ${exercise.date || ''}, ${exercise.time || ''}`;
  };

  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          {/* Profile Card */}
          <ProfileCard 
            healthData={healthData} 
            bmi={bmi}
            onUpdate={() => setRefreshKey(prev => prev + 1)}
          />

          {/* Quick Stats */}
          <QuickStats healthData={healthData} yesterdayData={yesterdayData} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Step Tracker */}
            <div className="lg:col-span-1">
              <StepTracker />
            </div>

            {/* Right Column - Health Metrics */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Today's Metrics</h2>
                <button
                  onClick={() => navigate('/health-input')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                >
                  <i className="fas fa-plus-circle mr-1"></i>Add More
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weight */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <i className="fas fa-weight text-blue-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Weight</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatValue(healthData.weight, 'kg')}
                  </h4>
                  <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.weight, 'kg')}</p>
                </div>

                {/* Calories */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                        <i className="fas fa-fire text-orange-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Calories</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatValue(healthData.calories, 'kcal')}
                  </h4>
                  <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.calories, 'kcal')}</p>
                </div>

                {/* Sleep */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <i className="fas fa-bed text-indigo-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Sleep</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatValue(healthData.sleep, 'hrs')}
                  </h4>
                  <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.sleep, 'hrs')}</p>
                </div>

                {/* Water */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                        <i className="fas fa-tint text-cyan-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Water</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatValue(healthData.water, 'L')}
                  </h4>
                  <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.water, 'L')}</p>
                </div>

                {/* Burned Calories */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                        <i className="fas fa-fire text-red-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">Burned</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {formatValue(healthData.BurCal, 'kcal')}
                  </h4>
                  <p className="text-sm text-gray-500">Yesterday: {formatValue(yesterdayData.BurCal, 'kcal')}</p>
                </div>

                {/* BMI */}
                <div className="card cursor-pointer hover:shadow-large transition-all group" onClick={() => navigate('/health-input')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <i className="fas fa-scale-balanced text-purple-600 text-xl"></i>
                      </div>
                      <h5 className="text-lg font-semibold text-gray-800">BMI</h5>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 group-hover:text-primary-500 transition-colors"></i>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-3xl font-bold text-gray-900">{bmi.value}</h4>
                    <span className={`px-3 py-1 rounded-lg font-semibold text-xs ${
                      bmi.status === 'Normal weight' ? 'bg-green-100 text-green-800' :
                      bmi.status === 'Underweight' ? 'bg-blue-100 text-blue-800' :
                      bmi.status === 'Overweight' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bmi.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/insights')}
              className="card text-center hover:shadow-large transition-all group"
            >
              <i className="fas fa-chart-line text-3xl text-primary-500 mb-2 group-hover:scale-110 transition-transform"></i>
              <h4 className="font-semibold text-gray-900">View Insights</h4>
              <p className="text-sm text-gray-500">Analytics & Trends</p>
            </button>
            <button
              onClick={() => navigate('/goals')}
              className="card text-center hover:shadow-large transition-all group"
            >
              <i className="fas fa-bullseye text-3xl text-green-500 mb-2 group-hover:scale-110 transition-transform"></i>
              <h4 className="font-semibold text-gray-900">My Goals</h4>
              <p className="text-sm text-gray-500">Track Progress</p>
            </button>
            <button
              onClick={() => navigate('/history')}
              className="card text-center hover:shadow-large transition-all group"
            >
              <i className="fas fa-history text-3xl text-indigo-500 mb-2 group-hover:scale-110 transition-transform"></i>
              <h4 className="font-semibold text-gray-900">History</h4>
              <p className="text-sm text-gray-500">Past Records</p>
            </button>
            <button
              onClick={() => navigate('/health-input')}
              className="card text-center hover:shadow-large transition-all group"
            >
              <i className="fas fa-plus-circle text-3xl text-orange-500 mb-2 group-hover:scale-110 transition-transform"></i>
              <h4 className="font-semibold text-gray-900">Add Data</h4>
              <p className="text-sm text-gray-500">Log Health Metrics</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;
