import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderKanban, Brain,
  CalendarCheck, Star, Settings, LogOut, Building2,
  TrendingUp, UserPlus, ChevronRight, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTenant } from '../data/tenants';
import { getEmployeesByTenant } from '../data/employees';

const TENANT_COLORS = {
  acme: '#6366f1',
  techflow: '#06b6d4',
  innovateco: '#10b981',
};

export default function Sidebar({ tenantId }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const tenant = tenantId ? getTenant(tenantId) : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      tenant_admin: 'Admin',
      hr_manager: 'HR Manager',
      employee: 'Employee',
    };
    return labels[role] || role;
  };

  const basePath = tenantId ? `/${tenantId}` : '/super-admin';

  const tenantNavItems = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', to: `${basePath}/dashboard` },
    { icon: <Users size={16} />, label: 'Employees', to: `${basePath}/employees` },
    { icon: <FolderKanban size={16} />, label: 'Projects', to: `${basePath}/projects` },
    { icon: <CalendarCheck size={16} />, label: 'Attendance', to: `${basePath}/attendance` },
    { icon: <Star size={16} />, label: 'Performance', to: `${basePath}/performance` },
  ];

  const aiNavItems = [
    { icon: <Brain size={16} />, label: 'AI Insights', to: `${basePath}/ai-insights`, badge: 'AI' },
    { icon: <Users size={16} />, label: 'Team Builder', to: `${basePath}/team-builder` },
    { icon: <UserPlus size={16} />, label: 'Hiring AI', to: `${basePath}/hiring` },
    { icon: <TrendingUp size={16} />, label: 'Increment AI', to: `${basePath}/increments` },
  ];

  const superAdminItems = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', to: '/super-admin/dashboard' },
    { icon: <Building2 size={16} />, label: 'All Tenants', to: '/super-admin/tenants' },
  ];

  // Determine if employee-role user is a manager (has direct reports)
  const allEmp = tenantId ? getEmployeesByTenant(tenantId) : [];
  const isEmpManager = user?.role === 'employee' &&
    allEmp.some((e) => e.manager === user.employeeId);

  // Employee nav: everyone sees Dashboard + My Profile + Attendance
  // Managers additionally see Projects and Performance
  const employeeNavItems = [
    { icon: <LayoutDashboard size={16} />, label: 'Dashboard', to: `${basePath}/dashboard` },
    { icon: <CalendarCheck size={16} />, label: 'My Attendance', to: `${basePath}/attendance` },
    { icon: <Users size={16} />, label: 'My Team', to: `${basePath}/employees` },
    ...(isEmpManager ? [
      { icon: <FolderKanban size={16} />, label: 'Projects', to: `${basePath}/projects` },
      { icon: <Star size={16} />, label: 'Performance', to: `${basePath}/performance` },
    ] : []),
  ];

  const navItems = user?.role === 'super_admin'
    ? superAdminItems
    : user?.role === 'employee'
    ? employeeNavItems
    : tenantNavItems;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">NH</div>
        <span className="logo-text">NexaHR</span>
      </div>

      {/* Tenant Badge */}
      {tenant && (
        <div className="sidebar-tenant" style={{ marginTop: 'var(--space-md)' }}>
          <div
            className="tenant-badge"
            style={{ background: TENANT_COLORS[tenantId] || 'var(--gradient-brand)' }}
          >
            {tenant.logo}
          </div>
          <div className="tenant-info">
            <div className="tenant-name">{tenant.name}</div>
            <div className="tenant-plan">{tenant.plan} Plan</div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Nav */}
        <div className="nav-section-label">Main</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {/* AI Section — only for non-employee roles in tenant context */}
        {tenantId && user?.role !== 'employee' && (
          <>
            <div className="nav-section-label" style={{ marginTop: 'var(--space-sm)' }}>
              AI Features
            </div>
            {aiNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
                {item.badge && <span className="nav-badge-ai">{item.badge}</span>}
              </NavLink>
            ))}
          </>
        )}

        {/* Settings */}
        <div className="nav-section-label" style={{ marginTop: 'var(--space-sm)' }}>
          System
        </div>
        {tenantId && (
          <NavLink
            to={`${basePath}/settings`}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings size={16} />
            Settings
          </NavLink>
        )}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{user?.avatar || user?.name?.[0]}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{roleLabel(user?.role)}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
