import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import ProgressChart from '../components/ProgressChart';
import InsightsCard from '../components/InsightsCard';

const Insights = () => {
  const { currentUser } = useAuth();
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const userHealthDataRef = ref(db, `HealthData/${currentUser.uid}`);
    
    const unsubscribe = onValue(userHealthDataRef, (snapshot) => {
      const data = snapshot.val();
      setLoading(false);

      if (!data) {
        setHealthData([]);
        setInsights({});
        return;
      }

      // Process data for charts (last 7 days)
      const sortedKeys = Object.keys(data).sort((a, b) => Number(a) - Number(b));
      const last7Days = sortedKeys.slice(-7);
      
      const chartData = last7Days.map((key) => {
        const entry = data[key];
        const date = new Date(Number(key));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: entry.weight || 0,
          calories: entry.calories || 0,
          water: entry.water || 0,
          sleep: entry.sleep || 0,
          steps: entry.steps || 0,
        };
      });

      setHealthData(chartData);

      // Calculate insights
      const allWeights = sortedKeys.map(k => data[k].weight).filter(w => w > 0);
      const allCalories = sortedKeys.map(k => data[k].calories).filter(c => c > 0);
      const allWater = sortedKeys.map(k => data[k].water).filter(w => w > 0);
      const allSleep = sortedKeys.map(k => data[k].sleep).filter(s => s > 0);

      const calculateAvg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      const calculateChange = (arr) => {
        if (arr.length < 2) return null;
        const first = arr[0];
        const last = arr[arr.length - 1];
        return ((last - first) / first) * 100;
      };

      setInsights({
        avgWeight: calculateAvg(allWeights),
        weightChange: calculateChange(allWeights),
        avgCalories: calculateAvg(allCalories),
        caloriesChange: calculateChange(allCalories),
        avgWater: calculateAvg(allWater),
        waterChange: calculateChange(allWater),
        avgSleep: calculateAvg(allSleep),
        sleepChange: calculateChange(allSleep),
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <BottomNav />

      <div className="lg:ml-36 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Your Health Insights
          </h1>

          {/* Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InsightsCard
              title="Average Weight"
              value={insights.avgWeight ? `${insights.avgWeight.toFixed(1)} kg` : '--'}
              change={insights.weightChange ? Math.abs(insights.weightChange).toFixed(1) : null}
              trend={insights.weightChange ? (insights.weightChange > 0 ? 'up' : 'down') : null}
              icon="fas fa-weight-scale"
              color="blue"
            />
            <InsightsCard
              title="Average Calories"
              value={insights.avgCalories ? `${insights.avgCalories.toFixed(0)} kcal` : '--'}
              change={insights.caloriesChange ? Math.abs(insights.caloriesChange).toFixed(1) : null}
              trend={insights.caloriesChange ? (insights.caloriesChange > 0 ? 'up' : 'down') : null}
              icon="fas fa-fire"
              color="orange"
            />
            <InsightsCard
              title="Average Water"
              value={insights.avgWater ? `${insights.avgWater.toFixed(1)} L` : '--'}
              change={insights.waterChange ? Math.abs(insights.waterChange).toFixed(1) : null}
              trend={insights.waterChange ? (insights.waterChange > 0 ? 'up' : 'down') : null}
              icon="fas fa-tint"
              color="blue"
            />
            <InsightsCard
              title="Average Sleep"
              value={insights.avgSleep ? `${insights.avgSleep.toFixed(1)} hrs` : '--'}
              change={insights.sleepChange ? Math.abs(insights.sleepChange).toFixed(1) : null}
              trend={insights.sleepChange ? (insights.sleepChange > 0 ? 'up' : 'down') : null}
              icon="fas fa-bed"
              color="primary"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Weight Trend (7 Days)</h3>
              <ProgressChart data={healthData} metric="weight" color="#3B6C92" />
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Calories Trend (7 Days)</h3>
              <ProgressChart data={healthData} type="bar" metric="calories" color="#F97316" />
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Water Intake (7 Days)</h3>
              <ProgressChart data={healthData} type="bar" metric="water" color="#06B6D4" />
            </div>
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sleep Duration (7 Days)</h3>
              <ProgressChart data={healthData} metric="sleep" color="#6366F1" />
            </div>
          </div>

          {healthData.length === 0 && (
            <div className="card text-center py-12">
              <i className="fas fa-chart-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">Start tracking your health data to see insights here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
