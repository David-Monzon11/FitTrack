import React from 'react';

const AchievementBadge = ({ achievement, unlocked = false }) => {
  return (
    <div
      className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-md'
          : 'bg-gray-100 border-2 border-gray-200 opacity-60'
      }`}
    >
      <div className={`text-4xl mb-2 ${unlocked ? '' : 'grayscale'}`}>
        {achievement.icon || '🏆'}
      </div>
      <h4 className={`font-semibold text-sm mb-1 ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
        {achievement.name}
      </h4>
      <p className={`text-xs text-center ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {achievement.description}
      </p>
      {unlocked && achievement.unlockedDate && (
        <span className="text-xs text-gray-500 mt-1">
          {new Date(achievement.unlockedDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
