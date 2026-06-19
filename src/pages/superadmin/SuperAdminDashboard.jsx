import { useNavigate } from 'react-router-dom';
import { Building2, Users, FolderKanban, TrendingUp, ArrowUpRight, Brain, Globe } from 'lucide-react';
import { getAllTenants } from '../../data/tenants';
import { getEmployeesByTenant } from '../../data/employees';
import { getProjectsByTenant } from '../../data/projects';
import { getAIInsights } from '../../data/aiInsights';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TENANT_COLORS = {
  acme: '#6366f1',
  techflow: '#06b6d4',
  innovateco: '#10b981',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const tenants = getAllTenants();

  const tenantData = tenants.map((t) => {
    const employees = getEmployeesByTenant(t.id);
    const projects = getProjectsByTenant(t.id);
    const insights = getAIInsights(t.id);
    return {
      ...t,
      employees: employees.length,
      activeProjects: projects.filter((p) => p.status === 'active').length,
      avgPerformance: insights?.overallHealthScore || 0,
    };
  });

  const totalEmployees = tenantData.reduce((s, t) => s + t.employees, 0);
  const totalProjects = tenantData.reduce((s, t) => s + t.activeProjects, 0);
  const avgHealth = Math.round(tenantData.reduce((s, t) => s + t.avgPerformance, 0) / tenantData.length);

  const chartData = tenantData.map((t) => ({
    name: t.name.split(' ')[0],
    employees: t.employees,
    health: t.avgPerformance,
    projects: t.activeProjects,
  }));

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">
              <span className="gradient-text-ai">NexaHR</span> Platform Overview
            </h1>
            <p className="page-subtitle">Super Admin · All tenants · Real-time platform metrics</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 10, fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
            <Globe size={14} />
            {tenants.length} Active Tenants
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Tenants', val: tenants.length, icon: <Building2 size={20} color="var(--accent)" />, bg: 'var(--bg-elevated)' },
          { label: 'Total Employees', val: totalEmployees, icon: <Users size={20} color="#0284c7" />, bg: 'rgba(2,132,199,0.1)' },
          { label: 'Active Projects', val: totalProjects, icon: <FolderKanban size={20} color="#059669" />, bg: 'rgba(5,150,105,0.1)' },
          { label: 'Avg Health Score', val: avgHealth, icon: <TrendingUp size={20} color="#d97706" />, bg: 'rgba(217,119,6,0.1)' },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Tenant Comparison Chart */}
        <div className="card animate-fade">
          <div className="section-header">
            <div>
              <div className="section-title">Tenant Comparison</div>
              <div className="section-subtitle">Employees · health score · projects</div>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="employees" name="Employees" fill="var(--accent)" radius={[3, 3, 0, 0]} opacity={0.75} />
                <Bar dataKey="health" name="Health Score" fill="#059669" radius={[3, 3, 0, 0]} opacity={0.65} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Tenant Access */}
        <div className="card animate-fade">
          <div className="section-header">
            <div>
              <div className="section-title">Quick Tenant Access</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {tenantData.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: '14px 16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => navigate(`/${t.id}/dashboard`)}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = TENANT_COLORS[t.id]; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: TENANT_COLORS[t.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                  {t.logo}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.industry} · {t.employees} employees</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: TENANT_COLORS[t.id], fontFamily: "'Space Grotesk', sans-serif" }}>{t.avgPerformance}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Health</div>
                </div>
                <ArrowUpRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tenant Cards */}
      <div className="section-header">
        <div className="section-title">Tenant Details</div>
      </div>
      <div className="grid-3 stagger">
        {tenantData.map((t) => (
          <div
            key={t.id}
            className="card animate-fade"
            style={{ cursor: 'pointer', borderTop: `3px solid ${TENANT_COLORS[t.id]}` }}
            onClick={() => navigate(`/${t.id}/dashboard`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-md)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: TENANT_COLORS[t.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>
                {t.logo}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.plan} Plan</div>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 10, marginBottom: 'var(--space-md)' }}>
              {[
                { label: 'Employees', val: t.employees },
                { label: 'Projects', val: t.activeProjects },
                { label: 'Health', val: `${t.avgPerformance}%` },
                { label: 'Revenue', val: t.metrics?.monthlyRevenue || 'N/A' },
              ].map((s) => (
                <div key={s.label} style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t.description}</p>
            <div style={{ marginTop: 'var(--space-md)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: TENANT_COLORS[t.id], fontSize: 13, fontWeight: 600 }}>
              Open Dashboard <ArrowUpRight size={14} style={{ marginLeft: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
