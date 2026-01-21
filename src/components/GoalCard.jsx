import React from 'react';

const GoalCard = ({ goal, currentValue, onEdit, onDelete }) => {
  const progress = goal.target > 0 ? Math.min((currentValue / goal.target) * 100, 100) : 0;
  const isCompleted = progress >= 100;

  const getGoalIcon = (type) => {
    const icons = {
      weight: 'fas fa-weight-scale',
      calories: 'fas fa-fire',
      steps: 'fas fa-walking',
      water: 'fas fa-tint',
      sleep: 'fas fa-bed',
      exercise: 'fas fa-dumbbell',
    };
    return icons[type] || 'fas fa-bullseye';
  };

  const getGoalColor = (type) => {
    const colors = {
      weight: 'text-blue-500',
      calories: 'text-orange-500',
      steps: 'text-green-500',
      water: 'text-cyan-500',
      sleep: 'text-indigo-500',
      exercise: 'text-purple-500',
    };
    return colors[type] || 'text-primary-500';
  };

  return (
    <div className={`card ${isCompleted ? 'border-2 border-green-500' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <i className={`${getGoalIcon(goal.type)} ${getGoalColor(goal.type)} text-2xl`}></i>
          <div>
            <h4 className="font-semibold text-gray-900">{goal.name}</h4>
            <p className="text-sm text-gray-500">{goal.type.charAt(0).toUpperCase() + goal.type.slice(1)} Goal</p>
          </div>
        </div>
        {isCompleted && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            <i className="fas fa-check-circle mr-1"></i>Completed
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">
            {currentValue.toFixed(1)} / {goal.target} {goal.unit}
          </span>
          <span className="font-semibold text-gray-900">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-sm font-semibold text-primary-600 hover:text-primary-700 py-1"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-sm font-semibold text-red-600 hover:text-red-700 py-1"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

export default GoalCard;
