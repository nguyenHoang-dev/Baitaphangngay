import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';
import ActivitiesPage from './pages/ActivitiesPage';
import ClassesPage from './pages/ClassesPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminReports from './pages/AdminReports';

import VerificationPage from './pages/VerificationPage';

import StudentClassPage from './pages/StudentClassPage';
import StudentReportsPage from './pages/StudentReportsPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminDashboard />} />
          <Route path="/admin/classes" element={<ClassesPage />} />
          <Route path="/admin/activities" element={<ActivitiesPage />} />
          <Route path="/admin/verification" element={<VerificationPage />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/class" element={<StudentClassPage />} />
          <Route path="/student/reports" element={<StudentReportsPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
