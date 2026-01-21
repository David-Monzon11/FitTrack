import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ProgressChart = ({ data, type = 'line', metric, color = '#3B6C92' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <i className="fas fa-chart-line text-4xl mb-2"></i>
          <p>No data available yet</p>
        </div>
      </div>
    );
  }

  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : Line;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis 
          dataKey="date" 
          stroke="#666"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#666"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
        <Legend />
        <DataComponent 
          type="monotone" 
          dataKey={metric} 
          stroke={color} 
          fill={color}
          strokeWidth={2}
          name={metric.charAt(0).toUpperCase() + metric.slice(1)}
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
