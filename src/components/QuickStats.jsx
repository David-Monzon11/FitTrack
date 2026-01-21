import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickStats = ({ healthData, yesterdayData }) => {
  const navigate = useNavigate();

  const calculateChange = (today, yesterday) => {
    if (!today || !yesterday) return null;
    const change = ((today - yesterday) / yesterday) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0,
      icon: change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down',
    };
  };

  const stats = [
    {
      label: 'Steps Today',
      value: healthData.steps || 0,
      unit: '',
      icon: 'fas fa-walking',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: calculateChange(healthData.steps, yesterdayData.steps),
      onClick: () => navigate('/health-input'),
    },
    {
      label: 'Calories Consumed',
      value: healthData.calories || 0,
      unit: 'kcal',
      icon: 'fas fa-fire',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: calculateChange(healthData.calories, yesterdayData.calories),
      onClick: () => navigate('/health-input'),
    },
    {
      label: 'Water Intake',
      value: healthData.water || 0,
      unit: 'L',
      icon: 'fas fa-tint',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: calculateChange(healthData.water, yesterdayData.water),
      onClick: () => navigate('/health-input'),
    },
    {
      label: 'Sleep Duration',
      value: healthData.sleep || 0,
      unit: 'hrs',
      icon: 'fas fa-bed',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: calculateChange(healthData.sleep, yesterdayData.sleep),
      onClick: () => navigate('/health-input'),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={stat.onClick}
          className={`${stat.bgColor} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all group`}
        >
          <div className="flex items-center justify-between mb-2">
            <i className={`${stat.icon} ${stat.color} text-xl`}></i>
            {stat.change && (
              <span
                className={`text-xs font-semibold flex items-center gap-1 ${
                  stat.change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <i className={`fas ${stat.change.icon}`}></i>
                {stat.change.value}%
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value} {stat.unit}
          </div>
          <div className="text-xs text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
