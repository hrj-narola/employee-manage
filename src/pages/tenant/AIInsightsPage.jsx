import { useParams } from 'react-router-dom';
import { Brain, Users, TrendingUp, UserPlus, ChevronRight, Zap, Target, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAIInsights } from '../../data/aiInsights';
import { getEmployeesByTenant } from '../../data/employees';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from 'recharts';

export default function AIInsightsPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const insights = getAIInsights(tenantId);
  const employees = getEmployeesByTenant(tenantId);

  if (!insights) return <div className="empty-state">No AI data available</div>;

  const radarData = [
    { subject: 'Performance', A: insights.overallHealthScore },
    { subject: 'Attendance', A: Math.round(employees.reduce((s, e) => s + e.attendanceRate, 0) / employees.length) },
    { subject: 'Project Delivery', A: 78 },
    { subject: 'Collaboration', A: 82 },
    { subject: 'Growth', A: 74 },
    { subject: 'Retention', A: 88 },
  ];

  const cards = [
    {
      icon: <Users size={22} color="var(--accent)" />,
      iconBg: 'var(--bg-elevated)',
      title: 'Team Builder',
      subtitle: 'AI suggests optimal team composition for new projects',
      count: `${insights.teamSuggestions.length} suggestions`,
      badge: 'Active',
      badgeType: 'success',
      path: `/${tenantId}/team-builder`,
    },
    {
      icon: <UserPlus size={22} color="#0284c7" />,
      iconBg: 'rgba(2,132,199,0.1)',
      title: 'Hiring Recommendations',
      subtitle: 'AI identifies skill gaps and recommends roles to fill',
      count: `${insights.hiringRecommendations.length} open roles`,
      badge: insights.hiringRecommendations.some((r) => r.priority === 'critical') ? 'Urgent' : 'Pending',
      badgeType: insights.hiringRecommendations.some((r) => r.priority === 'critical') ? 'danger' : 'warning',
      path: `/${tenantId}/hiring`,
    },
    {
      icon: <TrendingUp size={22} color="#059669" />,
      iconBg: 'rgba(5,150,105,0.1)',
      title: 'Increment Analysis',
      subtitle: 'Data-backed salary increment recommendations per employee',
      count: `${insights.incrementRecommendations.length} employees reviewed`,
      badge: 'Ready',
      badgeType: 'success',
      path: `/${tenantId}/increments`,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title gradient-text-ai">AI Intelligence Hub</h1>
            <p className="page-subtitle">
              AI-powered insights to make better workforce decisions
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 10,
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
          }}>
            <Zap size={14} />
            AI Engine Active
          </div>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="ai-card animate-fade" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="ai-label">
          <Brain size={14} />
          Organization AI Health Report
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '4rem',
              fontWeight: 800,
              background: 'var(--gradient-ai)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
            }}>
              {insights.overallHealthScore}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Overall Health Score</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {insights.atRiskEmployees.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 13 }}>
                  <AlertCircle size={14} />
                  {insights.atRiskEmployees.length} employee(s) at risk — needs immediate attention
                </div>
              )}
              {insights.atRiskEmployees.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontSize: 13 }}>
                  <Target size={14} />
                  No critical risks detected — organization is healthy
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(99,102,241,0.15)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.12} strokeWidth={2} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid-3 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {cards.map((c) => (
          <div
            key={c.title}
            className="card animate-fade"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(c.path)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
              <div style={{
                width: 48, height: 48,
                background: c.iconBg,
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {c.icon}
              </div>
              <span className={`badge badge-${c.badgeType}`}>{c.badge}</span>
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>{c.title}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>{c.subtitle}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.count}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          </div>
        ))}
      </div>

      {/* At Risk Employees */}
      {insights.atRiskEmployees.length > 0 && (
        <div className="card animate-fade" style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(245,158,11,0.05) 100%)',
          borderColor: 'rgba(239,68,68,0.2)',
          marginBottom: 'var(--space-xl)',
        }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} color="#ef4444" />
              <div className="section-title" style={{ color: '#ef4444' }}>At-Risk Employees</div>
            </div>
          </div>
          {insights.atRiskEmployees.map((id) => {
            const emp = employees.find((e) => e.id === id);
            if (!emp) return null;
            return (
              <div
                key={id}
                style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.06)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.12)', cursor: 'pointer' }}
                onClick={() => navigate(`/${tenantId}/employees/${id}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                    {emp.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
                    {emp.attendanceRate < 90 ? '⚠ Low Attendance' : '⚠ Performance Drop'}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  {emp.aiInsight.summary}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Performers */}
      <div className="card animate-fade" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(6,182,212,0.05) 100%)',
        borderColor: 'rgba(16,185,129,0.2)',
      }}>
        <div className="section-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={18} color="#10b981" />
            <div className="section-title" style={{ color: '#10b981' }}>Top Performers</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {insights.topPerformers.map((id) => {
            const emp = employees.find((e) => e.id === id);
            if (!emp) return null;
            return (
              <div
                key={id}
                style={{
                  padding: '12px 16px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onClick={() => navigate(`/${tenantId}/employees/${id}`)}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gradient-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                  {emp.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score: {emp.performanceScore}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
