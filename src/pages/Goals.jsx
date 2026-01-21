import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import GoalCard from '../components/GoalCard';
import Modal from '../components/Modal';

const Goals = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [currentValues, setCurrentValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'weight',
    target: '',
    unit: 'kg',
  });

  useEffect(() => {
    if (!currentUser) return;

    // Load goals
    const goalsRef = ref(db, `Goals/${currentUser.uid}`);
    const unsubscribeGoals = onValue(goalsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const goalsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setGoals(goalsList);
      } else {
        setGoals([]);
      }
    });

    // Load current health data for progress calculation
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayId = today.getTime();
    const todayRef = ref(db, `HealthData/${currentUser.uid}/${todayId}`);
    const unsubscribeToday = onValue(todayRef, (snapshot) => {
      const data = snapshot.val() || {};
      setCurrentValues({
        weight: data.weight || 0,
        calories: data.calories || 0,
        steps: data.steps || 0,
        water: data.water || 0,
        sleep: data.sleep || 0,
        exercise: data.exercise ? 1 : 0,
      });
    });

    return () => {
      unsubscribeGoals();
      unsubscribeToday();
    };
  }, [currentUser]);

  const handleSaveGoal = async () => {
    if (!formData.name || !formData.target) return;

    const goalData = {
      name: formData.name,
      type: formData.type,
      target: parseFloat(formData.target),
      unit: formData.unit,
      createdAt: Date.now(),
    };

    try {
      if (editingGoal) {
        // Update existing goal
        await set(ref(db, `Goals/${currentUser.uid}/${editingGoal}`), {
          ...goalData,
          createdAt: goals.find((g) => g.id === editingGoal)?.createdAt || Date.now(),
        });
      } else {
        // Create new goal using push() for better Firebase compatibility
        await push(ref(db, `Goals/${currentUser.uid}`), goalData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', type: 'weight', target: '', unit: 'kg' });
      setEditingGoal(null);
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal: ' + error.message + '. Please make sure you have permission to write to the database.');
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id);
    setFormData({
      name: goal.name,
      type: goal.type,
      target: goal.target.toString(),
      unit: goal.unit,
    });
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await remove(ref(db, `Goals/${currentUser.uid}/${goalId}`));
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Error deleting goal: ' + error.message);
    }
  };

  const getUnitForType = (type) => {
    const units = {
      weight: 'kg',
      calories: 'kcal',
      steps: 'steps',
      water: 'L',
      sleep: 'hrs',
      exercise: 'sessions',
    };
    return units[type] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Goals</h1>
            <button
              onClick={() => {
                setEditingGoal(null);
                setFormData({ name: '', type: 'weight', target: '', unit: 'kg' });
                setIsModalOpen(true);
              }}
              className="btn-primary"
            >
              <i className="fas fa-plus mr-2"></i>New Goal
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="card text-center py-12">
              <i className="fas fa-bullseye text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg mb-4">No goals set yet.</p>
              <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                Create Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  currentValue={currentValues[goal.type] || 0}
                  onEdit={() => handleEditGoal(goal)}
                  onDelete={() => handleDeleteGoal(goal.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
          setFormData({ name: '', type: 'weight', target: '', unit: 'kg' });
        }}
        title={editingGoal ? 'Edit Goal' : 'Create New Goal'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveGoal();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Lose 5kg by summer"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Type</label>
            <select
              value={formData.type}
              onChange={(e) => {
                const type = e.target.value;
                setFormData({
                  ...formData,
                  type,
                  unit: getUnitForType(type),
                });
              }}
              className="input-field"
              required
            >
              <option value="weight">Weight</option>
              <option value="calories">Calories</option>
              <option value="steps">Steps</option>
              <option value="water">Water Intake</option>
              <option value="sleep">Sleep</option>
              <option value="exercise">Exercise Sessions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Target Value</label>
            <input
              type="number"
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              placeholder={`Enter target ${formData.unit}`}
              required
              min="0"
              step="0.1"
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-1">Unit: {formData.unit}</p>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingGoal(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;
