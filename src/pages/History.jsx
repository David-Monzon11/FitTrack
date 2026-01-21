import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

const History = () => {
  const { currentUser } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const userHealthDataRef = ref(db, `HealthData/${currentUser.uid}`);
    
    const unsubscribe = onValue(userHealthDataRef, (snapshot) => {
      const data = snapshot.val();
      setLoading(false);

      if (!data) {
        setHistoryData([]);
        return;
      }

      // Sort keys descending to show latest entries first
      const sortedKeys = Object.keys(data).sort((a, b) => Number(b) - Number(a));
      
      const formattedData = sortedKeys.map((key) => ({
        date: formatDate(Number(key)),
        ...data[key],
      }));

      setHistoryData(formattedData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatExercise = (exercise) => {
    if (!exercise) return '-';
    let str = exercise.type || 'Exercise';
    if (exercise.date) str += ` : ${exercise.date}`;
    if (exercise.time) str += `, ${exercise.time}`;
    return str;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
            Health Data History
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Loading data...</p>
            </div>
          ) : historyData.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-history text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">No health data available yet.</p>
              <p className="text-gray-500">Start tracking your health data to see your history here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-medium overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Date</th>
                      <th className="px-6 py-4 text-center font-semibold">Weight (kg)</th>
                      <th className="px-6 py-4 text-center font-semibold">Height (cm)</th>
                      <th className="px-6 py-4 text-center font-semibold">Water (L)</th>
                      <th className="px-6 py-4 text-center font-semibold">Calories (kcal)</th>
                      <th className="px-6 py-4 text-center font-semibold">Sleep (hrs)</th>
                      <th className="px-6 py-4 text-center font-semibold">Burned (kcal)</th>
                      <th className="px-6 py-4 text-center font-semibold">Exercise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historyData.map((entry, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">{entry.date}</td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.weight ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.height ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.water ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.calories ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.sleep ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          {entry.BurCal ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-gray-600">{formatExercise(entry.exercise)}</span>
                            {entry.exercise?.completed && (
                              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                Completed
                              </span>
                            )}
                            {entry.exercise && !entry.exercise.completed && (
                              <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
