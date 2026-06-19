import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Star, Brain, BarChart2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { getEmployeesByTenant } from '../../data/employees';
import { getAIInsights } from '../../data/aiInsights';

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

export default function PerformancePage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const employees = getEmployeesByTenant(tenantId);
  const insights = getAIInsights(tenantId);

  const sorted = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);
  const chartData = sorted.map((e) => ({
    name: e.name.split(' ')[0],
    score: e.performanceScore,
    attendance: e.attendanceRate,
  }));

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={14} color="#10b981" />;
    if (trend === 'down') return <TrendingDown size={14} color="#ef4444" />;
    return <Minus size={14} color="var(--text-muted)" />;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Performance Reviews</h1>
        <p className="page-subtitle">AI-driven performance analysis and review management</p>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Avg Performance', val: Math.round(employees.reduce((s, e) => s + e.performanceScore, 0) / employees.length), color: '#6366f1' },
          { label: 'Top Performers', val: employees.filter((e) => e.performanceScore >= 90).length, color: '#10b981' },
          { label: 'Needs Improvement', val: employees.filter((e) => e.performanceScore < 75).length, color: '#f59e0b' },
          { label: 'Reviews Pending', val: employees.length, color: '#06b6d4' },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card animate-fade" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="section-header">
          <div>
            <div className="section-title">Performance vs Attendance</div>
            <div className="section-subtitle">Employee comparison — scores out of 100</div>
          </div>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" name="Performance Score" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
              <Bar dataKey="attendance" name="Attendance %" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.65} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Review Cards */}
      <div className="section-header">
        <div>
          <div className="section-title">Individual Reviews</div>
          <div className="section-subtitle">AI-assisted performance summary for each employee</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {sorted.map((emp, i) => (
          <div
            key={emp.id}
            className="card animate-fade"
            style={{ cursor: 'pointer', animationDelay: `${i * 50}ms` }}
            onClick={() => navigate(`/${tenantId}/employees/${emp.id}`)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
              {/* Rank */}
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)' : 'var(--bg-elevated)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: i < 3 ? 'white' : 'var(--text-muted)',
                flexShrink: 0,
              }}>
                #{i + 1}
              </div>

              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 180px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                  {emp.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                </div>
              </div>

              {/* Scores */}
              <div style={{ display: 'flex', gap: 'var(--space-xl)', flex: '2 1 320px', alignItems: 'center' }}>
                <div style={{ minWidth: 160 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Performance</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{emp.performanceScore}</span>
                  </div>
                  <div className="progress-bar-wrap" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{
                      width: `${emp.performanceScore}%`,
                      background: emp.performanceScore >= 90 ? 'var(--gradient-success)' : 'var(--gradient-brand)',
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <TrendIcon trend={emp.aiInsight.trend} />
                  {emp.aiInsight.trend === 'up' ? 'Rising' : emp.aiInsight.trend === 'down' ? 'Declining' : 'Stable'}
                </div>
              </div>

              {/* AI Summary */}
              <div style={{ flex: '3 1 240px', padding: '8px 10px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <Brain size={11} color="var(--accent)" style={{ marginRight: 6, verticalAlign: 'middle' }} />
                {emp.aiInsight.summary.substring(0, 100)}...
              </div>

              {/* Increment */}
              <div style={{
                padding: '6px 14px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 8,
                fontSize: 14, fontWeight: 800, color: '#10b981',
                fontFamily: "'Space Grotesk', sans-serif",
                whiteSpace: 'nowrap',
              }}>
                +{emp.aiInsight.incrementRecommendation}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
