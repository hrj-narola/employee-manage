import { useParams } from 'react-router-dom';
import { UserPlus, AlertCircle, Clock, DollarSign, TrendingUp, Brain, Zap } from 'lucide-react';
import { getAIInsights } from '../../data/aiInsights';

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  high: { label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
  medium: { label: 'Medium', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
};

const DEMAND_CONFIG = {
  'very high': { color: '#ef4444' },
  'high': { color: '#f59e0b' },
  'medium': { color: '#6366f1' },
};

export default function HiringPage() {
  const { tenantId } = useParams();
  const insights = getAIInsights(tenantId);
  const recs = insights?.hiringRecommendations || [];

  const criticalCount = recs.filter((r) => r.priority === 'critical').length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title gradient-text-ai">AI Hiring Recommendations</h1>
            <p className="page-subtitle">AI analyzes skill gaps, project pipeline, and market demand to guide hiring</p>
          </div>
          {criticalCount > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: '#ef4444',
            }}>
              <AlertCircle size={14} />
              {criticalCount} Critical Role{criticalCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid-3 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Recommendations', val: recs.length, icon: <UserPlus size={20} color="#6366f1" />, bg: 'rgba(99,102,241,0.12)' },
          { label: 'Critical Urgency', val: criticalCount, icon: <AlertCircle size={20} color="#ef4444" />, bg: 'rgba(239,68,68,0.12)' },
          { label: 'Avg. Time to Hire', val: '7 weeks', icon: <Clock size={20} color="#06b6d4" />, bg: 'rgba(6,182,212,0.12)' },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {recs.map((rec, i) => {
          const priority = PRIORITY_CONFIG[rec.priority];
          const demand = DEMAND_CONFIG[rec.marketDemand] || { color: '#6366f1' };
          return (
            <div
              key={i}
              className="card animate-fade"
              style={{
                background: `linear-gradient(135deg, ${priority.bg} 0%, rgba(6,182,212,0.03) 100%)`,
                border: `1px solid ${priority.border}`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                {/* Role Info */}
                <div style={{ flex: 2, minWidth: 260 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px',
                      background: priority.bg, color: priority.color,
                      border: `1px solid ${priority.border}`,
                      borderRadius: 99,
                    }}>
                      {priority.label} Priority
                    </span>
                    <span style={{ fontSize: 11, color: demand.color, fontWeight: 600 }}>
                      Market Demand: {rec.marketDemand}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>
                    {rec.role}
                  </h3>

                  {/* AI Reasoning */}
                  <div style={{ padding: '10px 12px', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 8, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Brain size={12} color="var(--accent)" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Reasoning</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rec.reasoning}</p>
                  </div>

                  {/* Required Skills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {rec.requiredSkills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', minWidth: 180 }}>
                  <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <DollarSign size={13} color="#10b981" />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Salary Range</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {rec.estimatedSalary}
                    </div>
                  </div>
                  <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Clock size={13} color="#06b6d4" />
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Time to Hire</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#06b6d4', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {rec.timeToHire}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {}}
                  >
                    <UserPlus size={14} />
                    Start Hiring
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
