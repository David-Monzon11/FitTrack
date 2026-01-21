import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Today from './pages/Today';
import HealthDataInput from './pages/HealthDataInput';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/today" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={currentUser ? <Navigate to="/today" replace /> : <Register />}
      />
      <Route
        path="/today"
        element={
          <ProtectedRoute>
            <Today />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health-input"
        element={
          <ProtectedRoute>
            <HealthDataInput />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/today" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
