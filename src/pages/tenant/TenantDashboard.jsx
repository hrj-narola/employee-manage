import { useParams, useNavigate } from 'react-router-dom';
import {
  Users, FolderKanban, TrendingUp, CalendarCheck,
  Brain, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Star, Activity, Zap, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getTenant } from '../../data/tenants';
import { getEmployeesByTenant } from '../../data/employees';
import { getProjectsByTenant } from '../../data/projects';
import { getAIInsights } from '../../data/aiInsights';
import { useAuth } from '../../context/AuthContext';

function StatCard({ icon, label, value, change, changeDir, iconBg, statGlow }) {
  return (
    <div className="stat-card animate-fade" style={{ '--stat-glow': statGlow }}>
      <div className="stat-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className={`stat-change ${changeDir}`}>
          {changeDir === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </div>
      )}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 13,
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TenantDashboard() {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const tenant = getTenant(tenantId);
  const employees = getEmployeesByTenant(tenantId);
  const projects = getProjectsByTenant(tenantId);
  const insights = getAIInsights(tenantId);

  if (!tenant) return <div>Tenant not found</div>;

  const activeProjects = projects.filter((p) => p.status === 'active');
  const avgPerf = Math.round(employees.reduce((a, e) => a + e.performanceScore, 0) / employees.length);
  const atRisk = insights?.atRiskEmployees?.length || 0;
  const topPerformers = insights?.topPerformers?.length || 0;

  const isEmployee = user?.role === 'employee';

  // If employee, redirect to their own profile context
  const employeeData = isEmployee
    ? employees.find((e) => e.id === user.employeeId)
    : null;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">
              {isEmployee ? `Welcome, ${user.name.split(' ')[0]} 👋` : `${tenant.name} Dashboard`}
            </h1>
            <p className="page-subtitle">
              {isEmployee
                ? 'Your personal performance overview'
                : `${tenant.industry} · ${tenant.employeeCount} Employees · ${tenant.plan} Plan`}
            </p>
          </div>
          {!isEmployee && (
            <div className="page-actions">
              <button
                className="btn btn-ai"
                onClick={() => navigate(`/${tenantId}/ai-insights`)}
              >
                <Brain size={16} />
                AI Insights
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {isEmployee && employeeData ? (
          <>
            <StatCard
              icon={<Star size={20} color="#f59e0b" />}
              label="Performance Score"
              value={employeeData.performanceScore}
              change="+3 this month"
              changeDir="up"
              iconBg="rgba(245,158,11,0.12)"
              statGlow="rgba(245,158,11,0.08)"
            />
            <StatCard
              icon={<CalendarCheck size={20} color="#10b981" />}
              label="Attendance Rate"
              value={`${employeeData.attendanceRate}%`}
              change="Above average"
              changeDir="up"
              iconBg="rgba(16,185,129,0.12)"
              statGlow="rgba(16,185,129,0.08)"
            />
            <StatCard
              icon={<FolderKanban size={20} color="#6366f1" />}
              label="Projects Completed"
              value={employeeData.projectsCompleted}
              iconBg="rgba(99,102,241,0.12)"
              statGlow="rgba(99,102,241,0.08)"
            />
            <StatCard
              icon={<Activity size={20} color="#06b6d4" />}
              label="Active Projects"
              value={employeeData.currentProjects.length}
              iconBg="rgba(6,182,212,0.12)"
              statGlow="rgba(6,182,212,0.08)"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<Users size={20} color="#6366f1" />}
              label="Total Employees"
              value={employees.length}
              change="+2 this month"
              changeDir="up"
              iconBg="rgba(99,102,241,0.12)"
              statGlow="rgba(99,102,241,0.08)"
            />
            <StatCard
              icon={<FolderKanban size={20} color="#06b6d4" />}
              label="Active Projects"
              value={activeProjects.length}
              change={`${projects.filter((p) => p.status === 'completed').length} completed`}
              changeDir="up"
              iconBg="rgba(6,182,212,0.12)"
              statGlow="rgba(6,182,212,0.08)"
            />
            <StatCard
              icon={<TrendingUp size={20} color="#10b981" />}
              label="Avg Performance"
              value={avgPerf}
              change={avgPerf > 80 ? '+4 vs last month' : '-2 vs last month'}
              changeDir={avgPerf > 80 ? 'up' : 'down'}
              iconBg="rgba(16,185,129,0.12)"
              statGlow="rgba(16,185,129,0.08)"
            />
            <StatCard
              icon={<AlertTriangle size={20} color="#f59e0b" />}
              label="At-Risk Employees"
              value={atRisk}
              change={atRisk === 0 ? 'All clear' : 'Needs attention'}
              changeDir={atRisk === 0 ? 'up' : 'down'}
              iconBg="rgba(245,158,11,0.12)"
              statGlow="rgba(245,158,11,0.08)"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Performance Trend Chart */}
        <div className="card animate-fade">
          <div className="section-header">
            <div>
              <div className="section-title">Performance Trend</div>
              <div className="section-subtitle">Last 6 months · organization-wide</div>
            </div>
            <span className="badge badge-success">↑ Trending</span>
          </div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={insights?.performanceTrend || []} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Performance" stroke="#6366f1" strokeWidth={2} fill="url(#perfGrad)" dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#06b6d4" strokeWidth={2} fill="url(#attendGrad)" dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects */}
        <div className="card animate-fade">
          <div className="section-header">
            <div>
              <div className="section-title">Active Projects</div>
              <div className="section-subtitle">{activeProjects.length} in progress</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/${tenantId}/projects`)}
            >
              View All <ArrowUpRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {activeProjects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                style={{
                  padding: '14px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 10,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => navigate(`/${tenantId}/projects`)}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span className={`badge badge-${p.healthScore >= 80 ? 'success' : p.healthScore >= 65 ? 'warning' : 'danger'}`}>
                    {p.healthScore}% health
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${p.progress}%`,
                      background: p.progress > 70
                        ? 'var(--gradient-success)'
                        : p.progress > 40
                        ? 'var(--gradient-brand)'
                        : 'var(--gradient-warm)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{p.team.length} members</span>
                  <span>{p.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      {!isEmployee && insights && (
        <div className="ai-card animate-fade" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="ai-label">
            <Brain size={14} />
            AI Recommendations
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 'var(--space-lg)',
            marginTop: 'var(--space-sm)',
          }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif" }}>
                {insights.hiringRecommendations.length}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Open hiring recommendations</div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 8, color: 'var(--accent)', paddingLeft: 0 }}
                onClick={() => navigate(`/${tenantId}/hiring`)}
              >
                View roles <ArrowUpRight size={12} />
              </button>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent2)', fontFamily: "'Space Grotesk', sans-serif" }}>
                {insights.incrementRecommendations.length}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Increment recommendations pending</div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 8, color: 'var(--accent2)', paddingLeft: 0 }}
                onClick={() => navigate(`/${tenantId}/increments`)}
              >
                Review now <ArrowUpRight size={12} />
              </button>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>
                {insights.topPerformers.length}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Top performers identified</div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 8, color: '#10b981', paddingLeft: 0 }}
                onClick={() => navigate(`/${tenantId}/employees`)}
              >
                View employees <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Performers */}
      {!isEmployee && (
        <div className="card animate-fade">
          <div className="section-header">
            <div>
              <div className="section-title">Top Performers</div>
              <div className="section-subtitle">AI-identified high performers this quarter</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate(`/${tenantId}/employees`)}
            >
              All Employees <ArrowUpRight size={13} />
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Performance</th>
                <th>Attendance</th>
                <th>Projects</th>
                <th>AI Trend</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .sort((a, b) => b.performanceScore - a.performanceScore)
                .slice(0, 5)
                .map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/${tenantId}/employees/${emp.id}`)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          className="emp-avatar"
                          style={{ width: 32, height: 32, fontSize: 12, borderRadius: 8 }}
                        >
                          {emp.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, maxWidth: 80 }}>
                          <div className="progress-bar-wrap">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${emp.performanceScore}%`,
                                background: emp.performanceScore >= 90 ? 'var(--gradient-success)' : 'var(--gradient-brand)',
                              }}
                            />
                          </div>
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                          {emp.performanceScore}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${emp.attendanceRate >= 95 ? 'success' : emp.attendanceRate >= 88 ? 'warning' : 'danger'}`}>
                        {emp.attendanceRate}%
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{emp.projectsCompleted}</td>
                    <td>
                      <span className={`badge badge-${emp.aiInsight.trend === 'up' ? 'success' : emp.aiInsight.trend === 'down' ? 'danger' : 'default'}`}>
                        {emp.aiInsight.trend === 'up' ? '↑ Rising' : emp.aiInsight.trend === 'down' ? '↓ Declining' : '→ Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
