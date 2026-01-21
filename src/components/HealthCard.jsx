import React from 'react';

const HealthCard = ({ title, icon, value, yesterdayValue, onUpdate, iconColor = 'text-primary-500' }) => {
  return (
    <div className="card">
      <h5 className="text-lg font-semibold text-gray-800 mb-4">{title}</h5>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <i className={`${icon} ${iconColor} text-2xl`}></i>
          <h3 className="text-2xl font-bold text-gray-900">
            {value || '--'}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-2">Yesterday: {yesterdayValue || '--'}</p>
          <button
            onClick={onUpdate}
            className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default HealthCard;
