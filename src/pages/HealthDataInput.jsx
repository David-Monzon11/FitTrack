import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import InputModal from '../components/InputModal';
import HealthCard from '../components/HealthCard';
import Modal from '../components/Modal';

const HealthDataInput = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState({});
  const [yesterdayData, setYesterdayData] = useState({});
  const [modals, setModals] = useState({
    weight: false,
    sleep: false,
    water: false,
    height: false,
    calories: false,
    burnedCalories: false,
    exercise: false,
  });

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

  const saveData = async (dataType, value) => {
    if (!currentUser) {
      alert('You must be logged in to save data.');
      return;
    }

    if (value === null || value === undefined || isNaN(value) || value <= 0) {
      alert('Please enter a valid value.');
      return;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayId = today.getTime();

    try {
      await update(ref(db, `HealthData/${currentUser.uid}/${todayId}`), {
        [dataType]: value,
      });
    } catch (error) {
      console.error('Error saving data:', error);
      let errorMessage = 'Error saving data: ' + error.message;
      
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage += '\n\nPlease check your Firebase database rules. See FIREBASE_RULES.md for instructions.';
      }
      
      alert(errorMessage);
    }
  };

  const saveExercise = async (exerciseData) => {
    if (!currentUser) {
      alert('You must be logged in to save exercise data.');
      return;
    }

    if (!exerciseData.type || !exerciseData.date || !exerciseData.time) {
      alert('Please fill in all exercise fields.');
      return;
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayId = today.getTime();

    try {
      await update(ref(db, `HealthData/${currentUser.uid}/${todayId}/exercise`), exerciseData);
      setModals({ ...modals, exercise: false });
    } catch (error) {
      console.error('Error saving exercise:', error);
      let errorMessage = 'Error saving exercise: ' + error.message;
      
      if (error.code === 'PERMISSION_DENIED') {
        errorMessage += '\n\nPlease check your Firebase database rules. See FIREBASE_RULES.md for instructions.';
      }
      
      alert(errorMessage);
    }
  };

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

  const bmi = calculateBMI();

  const [exerciseForm, setExerciseForm] = useState({
    type: 'Biking',
    date: new Date().toISOString().split('T')[0],
    time: '',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex-1">
              Today's Health Data
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weight */}
            <HealthCard
              title="Your Weight"
              icon="fas fa-weight-scale"
              value={formatValue(healthData.weight, 'kg')}
              yesterdayValue={formatValue(yesterdayData.weight, 'kg')}
              onUpdate={() => setModals({ ...modals, weight: true })}
              iconColor="text-primary-500"
            />

            {/* Sleep */}
            <HealthCard
              title="Your Sleep"
              icon="fas fa-bed"
              value={formatValue(healthData.sleep, 'hrs')}
              yesterdayValue={formatValue(yesterdayData.sleep, 'hrs')}
              onUpdate={() => setModals({ ...modals, sleep: true })}
              iconColor="text-indigo-500"
            />

            {/* Water */}
            <HealthCard
              title="Water Intake"
              icon="fas fa-glass-water"
              value={formatValue(healthData.water, 'L')}
              yesterdayValue={formatValue(yesterdayData.water, 'L')}
              onUpdate={() => setModals({ ...modals, water: true })}
              iconColor="text-blue-500"
            />

            {/* Height */}
            <HealthCard
              title="Your Height"
              icon="fas fa-ruler"
              value={formatValue(healthData.height, 'cm')}
              yesterdayValue={formatValue(yesterdayData.height, 'cm')}
              onUpdate={() => setModals({ ...modals, height: true })}
              iconColor="text-yellow-500"
            />

            {/* Calories */}
            <HealthCard
              title="Calories Intake"
              icon="fas fa-bowl-food"
              value={formatValue(healthData.calories, 'kcal')}
              yesterdayValue={formatValue(yesterdayData.calories, 'kcal')}
              onUpdate={() => setModals({ ...modals, calories: true })}
              iconColor="text-orange-500"
            />

            {/* Burned Calories */}
            <HealthCard
              title="Burned Calories"
              icon="fas fa-fire"
              value={formatValue(healthData.BurCal, 'kcal')}
              yesterdayValue={formatValue(yesterdayData.BurCal, 'kcal')}
              onUpdate={() => setModals({ ...modals, burnedCalories: true })}
              iconColor="text-red-500"
            />

            {/* Exercise */}
            <div className="card">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Exercise Schedule</h5>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <i className="fas fa-running text-green-500 text-2xl"></i>
                  <h4 className="text-lg font-bold text-gray-900">
                    {healthData.exercise
                      ? `${healthData.exercise.type}: ${healthData.exercise.date}, ${healthData.exercise.time}`
                      : '--'}
                  </h4>
                </div>
                <button
                  onClick={() => setModals({ ...modals, exercise: true })}
                  className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            {/* BMI */}
            <div className="card">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Body Mass Index</h5>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <i className="fas fa-scale-balanced text-purple-500 text-2xl"></i>
                  <h4 className="text-2xl font-bold text-gray-900">{bmi.value}</h4>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-semibold text-sm">
                  {bmi.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InputModal
        isOpen={modals.weight}
        onClose={() => setModals({ ...modals, weight: false })}
        onSave={(value) => saveData('weight', value)}
        title="Enter Your Weight"
        label="Weight"
        placeholder="Enter your weight"
        unit="kg"
      />

      <InputModal
        isOpen={modals.sleep}
        onClose={() => setModals({ ...modals, sleep: false })}
        onSave={(value) => saveData('sleep', value)}
        title="Enter Your Sleep Duration"
        label="Sleep Duration"
        placeholder="Enter hours slept"
        unit="hours"
      />

      <InputModal
        isOpen={modals.water}
        onClose={() => setModals({ ...modals, water: false })}
        onSave={(value) => saveData('water', value)}
        title="Enter Your Water Intake"
        label="Water Intake"
        placeholder="Enter liters consumed"
        unit="liters"
      />

      <InputModal
        isOpen={modals.height}
        onClose={() => setModals({ ...modals, height: false })}
        onSave={(value) => saveData('height', value)}
        title="Enter Your Height"
        label="Height"
        placeholder="Enter your height"
        unit="cm"
      />

      <InputModal
        isOpen={modals.calories}
        onClose={() => setModals({ ...modals, calories: false })}
        onSave={(value) => saveData('calories', value)}
        title="Enter Your Calories Intake"
        label="Calories Intake"
        placeholder="Enter calories consumed"
        unit="kcal"
      />

      <InputModal
        isOpen={modals.burnedCalories}
        onClose={() => setModals({ ...modals, burnedCalories: false })}
        onSave={(value) => saveData('BurCal', value)}
        title="Enter Your Burned Calories"
        label="Burned Calories"
        placeholder="Enter calories burned"
        unit="kcal"
      />

      {/* Exercise Modal */}
      <Modal
        isOpen={modals.exercise}
        onClose={() => setModals({ ...modals, exercise: false })}
        title="Exercise Completed"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (exerciseForm.type && exerciseForm.date && exerciseForm.time) {
              saveExercise(exerciseForm);
            } else {
              alert('Please fill in all fields.');
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Exercise Type
            </label>
            <select
              value={exerciseForm.type}
              onChange={(e) => setExerciseForm({ ...exerciseForm, type: e.target.value })}
              className="input-field"
              required
            >
              <option value="Biking">Biking</option>
              <option value="Jogging">Jogging</option>
              <option value="Walking">Walking</option>
              <option value="Running">Running</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={exerciseForm.date}
              onChange={(e) => setExerciseForm({ ...exerciseForm, date: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
            <input
              type="time"
              value={exerciseForm.time}
              onChange={(e) => setExerciseForm({ ...exerciseForm, time: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => setModals({ ...modals, exercise: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Exercise
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HealthDataInput;
