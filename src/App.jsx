import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import AppLayout from './components/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import TenantDashboard from './pages/tenant/TenantDashboard';
import EmployeesPage from './pages/tenant/EmployeesPage';
import EmployeeDetailPage from './pages/tenant/EmployeeDetailPage';
import ProjectsPage from './pages/tenant/ProjectsPage';
import AttendancePage from './pages/tenant/AttendancePage';
import PerformancePage from './pages/tenant/PerformancePage';
import AIInsightsPage from './pages/tenant/AIInsightsPage';
import TeamBuilderPage from './pages/tenant/TeamBuilderPage';
import HiringPage from './pages/tenant/HiringPage';
import IncrementsPage from './pages/tenant/IncrementsPage';
import SettingsPage from './pages/tenant/SettingsPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import TenantsPage from './pages/superadmin/TenantsPage';

function UnauthorizedPage() {
  return (
    <div className="loading-screen">
      <h2 style={{ color: 'var(--danger)' }}>Access Denied</h2>
      <p style={{ color: 'var(--text-secondary)' }}>You don't have permission to view this page.</p>
      <a href="/login" className="btn btn-secondary" style={{ marginTop: 16 }}>Go to Login</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Super Admin */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute minRole="super_admin">
              <AppLayout title="NexaHR Platform" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="tenants" element={<TenantsPage />} />
        </Route>

        {/* Tenant Routes */}
        <Route
          path="/:tenantId"
          element={
            <ProtectedRoute minRole="employee">
              <AppLayout title="NexaHR" />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:employeeId" element={<EmployeeDetailPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="ai-insights" element={<AIInsightsPage />} />
          <Route path="team-builder" element={<TeamBuilderPage />} />
          <Route path="hiring" element={<HiringPage />} />
          <Route path="increments" element={<IncrementsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
