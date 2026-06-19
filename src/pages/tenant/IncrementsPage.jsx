import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Brain, ArrowUpRight } from 'lucide-react';
import { getAIInsights } from '../../data/aiInsights';
import { getEmployeesByTenant } from '../../data/employees';

export default function IncrementsPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const insights = getAIInsights(tenantId);
  const employees = getEmployeesByTenant(tenantId);
  const recs = insights?.incrementRecommendations || [];

  const totalCurrentSalary = recs.reduce((s, r) => s + r.currentSalary, 0);
  const totalNewSalary = recs.reduce((s, r) => s + r.newSalary, 0);
  const totalIncrease = totalNewSalary - totalCurrentSalary;
  const avgIncrement = recs.length > 0 ? Math.round(recs.reduce((s, r) => s + r.recommendedIncrement, 0) / recs.length) : 0;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title gradient-text-ai">AI Increment Recommendations</h1>
            <p className="page-subtitle">Data-driven salary increment analysis based on performance, market rates, and contribution</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Employees Reviewed', val: recs.length, icon: <TrendingUp size={20} color="#6366f1" />, bg: 'rgba(99,102,241,0.12)' },
          { label: 'Avg. Increment', val: `${avgIncrement}%`, icon: <ArrowUpRight size={20} color="#10b981" />, bg: 'rgba(16,185,129,0.12)' },
          { label: 'Total Salary Increase', val: `$${(totalIncrease / 1000).toFixed(0)}K/yr`, icon: <DollarSign size={20} color="#06b6d4" />, bg: 'rgba(6,182,212,0.12)' },
          { label: 'Revised Budget', val: `$${(totalNewSalary / 1000).toFixed(0)}K/yr`, icon: <DollarSign size={20} color="#f59e0b" />, bg: 'rgba(245,158,11,0.12)' },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade">
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recommendations Table Card */}
      <div className="card animate-fade">
        <div className="section-header">
          <div>
            <div className="section-title">Increment Analysis</div>
            <div className="section-subtitle">AI-generated recommendations · yearly performance cycle</div>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Current Salary</th>
              <th>Increment %</th>
              <th>New Salary</th>
              <th>Period</th>
              <th>AI Reasoning</th>
            </tr>
          </thead>
          <tbody>
            {recs.map((rec) => {
              const emp = employees.find((e) => e.id === rec.employeeId);
              if (!emp) return null;
              const isHighIncrement = rec.recommendedIncrement >= 14;
              const isLowIncrement = rec.recommendedIncrement <= 8;
              return (
                <tr key={rec.employeeId} onClick={() => navigate(`/${tenantId}/employees/${rec.employeeId}`)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
                        {emp.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    ${rec.currentSalary.toLocaleString()}
                  </td>
                  <td>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '4px 12px',
                      borderRadius: 99,
                      background: isHighIncrement ? 'rgba(16,185,129,0.1)' : isLowIncrement ? 'rgba(239,68,68,0.1)' : 'rgba(6,182,212,0.1)',
                      color: isHighIncrement ? '#10b981' : isLowIncrement ? '#ef4444' : '#06b6d4',
                      fontWeight: 700, fontSize: 13,
                    }}>
                      <ArrowUpRight size={12} />
                      +{rec.recommendedIncrement}%
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#10b981', fontFamily: "'Space Grotesk', sans-serif" }}>
                    ${rec.newSalary.toLocaleString()}
                  </td>
                  <td>
                    <span className="badge badge-default" style={{ textTransform: 'capitalize' }}>
                      {rec.period}
                    </span>
                  </td>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <Brain size={12} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {rec.reasoning.length > 100 ? rec.reasoning.substring(0, 100) + '...' : rec.reasoning}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
