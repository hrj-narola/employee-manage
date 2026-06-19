import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, minRole = 'employee' }) {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading NexaHR...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!hasPermission(minRole)) return <Navigate to="/unauthorized" replace />;

  return children;
}

export function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (user) {
    if (user.role === 'super_admin') return <Navigate to="/super-admin/dashboard" replace />;
    return <Navigate to={`/${user.tenantId}/dashboard`} replace />;
  }

  return children;
}
