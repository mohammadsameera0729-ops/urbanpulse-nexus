import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public & Auth Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/public/VerifyEmailPage';
import { AccountCreatedPage } from '../pages/public/AccountCreatedPage';

// Citizen Pages
import { CitizenDashboardPage } from '../pages/citizen/CitizenDashboardPage';
import { ReportComplaintPage } from '../pages/citizen/ReportComplaintPage';
import { MyComplaintsPage } from '../pages/citizen/MyComplaintsPage';
import { ComplaintDetailsPage } from '../pages/citizen/ComplaintDetailsPage';
import { NotificationsPage } from '../pages/citizen/NotificationsPage';
import { ProfilePage } from '../pages/citizen/ProfilePage';
import { CitizenSettingsPage } from '../pages/citizen/CitizenSettingsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ComplaintManagementPage } from '../pages/admin/ComplaintManagementPage';
import { CitizenManagementPage } from '../pages/admin/CitizenManagementPage';
import { DepartmentManagementPage } from '../pages/admin/DepartmentManagementPage';
import { StaffManagementPage } from '../pages/admin/StaffManagementPage';
import { TrafficMonitoringPage } from '../pages/admin/TrafficMonitoringPage';
import { TrafficIntelligencePage } from '../pages/admin/TrafficIntelligencePage';
import { AIDetectionCenterPage } from '../pages/admin/AIDetectionCenterPage';
import { AnalyticsPage } from '../pages/admin/AnalyticsPage';
import { ReportsPage } from '../pages/admin/ReportsPage';
import { AdminNotificationsPage } from '../pages/admin/AdminNotificationsPage';
import { SettingsPage } from '../pages/admin/SettingsPage';
import { AdminProfilePage } from '../pages/admin/AdminProfilePage';

// Staff Layout & Pages
import { StaffLayout } from '../layouts/StaffLayout';
import { StaffDashboardPage } from '../pages/staff/StaffDashboardPage';

// Common / Specialized Pages
import { InteractiveMapPage } from '../pages/common/InteractiveMapPage';
import { HelpCenterPage } from '../pages/common/HelpCenterPage';
import { NotFoundPage } from '../pages/common/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/account-created" element={<AccountCreatedPage />} />
        <Route path="/map" element={<InteractiveMapPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
      </Route>

      {/* Citizen Portal Layout Routes */}
      <Route
        path="/citizen"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/citizen/dashboard" replace />} />
        <Route path="dashboard" element={<CitizenDashboardPage />} />
        <Route path="report-complaint" element={<ReportComplaintPage />} />
        <Route path="my-complaints" element={<MyComplaintsPage />} />
        <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<CitizenSettingsPage />} />
      </Route>

      {/* Staff Portal Layout Routes */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<CitizenSettingsPage />} />
      </Route>

      {/* Admin Operations Layout Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="complaints" element={<ComplaintManagementPage />} />
        <Route path="users" element={<CitizenManagementPage />} />
        <Route path="citizens" element={<CitizenManagementPage />} />
        <Route path="departments" element={<DepartmentManagementPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="traffic" element={<TrafficMonitoringPage />} />
        <Route path="gis-map" element={<InteractiveMapPage />} />
        <Route path="traffic-intelligence" element={<TrafficIntelligencePage />} />
        <Route path="ai-detection" element={<AIDetectionCenterPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

