import React from 'react';

const InsightsCard = ({ title, value, change, trend, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const trendIcon = trend === 'up' ? 'fa-arrow-up' : trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <i className={`${icon} text-xl`}></i>
        </div>
        {change !== null && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <i className={`fas ${trendIcon} text-sm`}></i>
            <span className="text-sm font-semibold">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
};

export default InsightsCard;
