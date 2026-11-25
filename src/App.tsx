import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from './components/ui/Toast';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';

import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AcademicsPage } from './pages/student/AcademicsPage';
import { AssignmentsExamsPage } from './pages/student/AssignmentsExamsPage';
import { TimetablePage } from './pages/student/TimetablePage';
import { FeesPage } from './pages/student/FeesPage';
import { NoticesPage } from './pages/student/NoticesPage';
import { ApplyNoDues } from './pages/student/ApplyNoDues';
import { MyApplications } from './pages/student/MyApplications';
import { StudentProfile } from './pages/student/StudentProfile';

import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { FacultyApplications } from './pages/faculty/FacultyApplications';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ToastContainer />
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="academics" element={<AcademicsPage />} />
                <Route path="assignments" element={<AssignmentsExamsPage />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="fees" element={<FeesPage />} />
                <Route path="notices" element={<NoticesPage />} />
                <Route path="apply" element={<ApplyNoDues />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              {/* Faculty Routes */}
              <Route
                path="/faculty"
                element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<FacultyDashboard />} />
                <Route path="applications" element={<FacultyApplications />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="applications" element={<AdminApplications />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
