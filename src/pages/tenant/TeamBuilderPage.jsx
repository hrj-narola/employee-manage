import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Users, Zap, ChevronRight, CheckCircle, Target, Clock } from 'lucide-react';
import { getAIInsights } from '../../data/aiInsights';
import { getEmployeesByTenant } from '../../data/employees';

export default function TeamBuilderPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const insights = getAIInsights(tenantId);
  const employees = getEmployeesByTenant(tenantId);
  const [activeIdx, setActiveIdx] = useState(0);

  if (!insights?.teamSuggestions?.length) {
    return (
      <div className="empty-state">
        <Brain size={48} color="var(--text-disabled)" />
        <h3 style={{ color: 'var(--text-secondary)' }}>No team suggestions yet</h3>
        <p>AI will generate suggestions based on upcoming projects</p>
      </div>
    );
  }

  const suggestion = insights.teamSuggestions[activeIdx];
  const teamMembers = suggestion.suggestedTeam.map((id) => employees.find((e) => e.id === id)).filter(Boolean);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title gradient-text-ai">AI Team Builder</h1>
            <p className="page-subtitle">AI analyzes skills, availability, and project needs to recommend optimal teams</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px',
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.2)',
            borderRadius: 10,
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
          }}>
            <Zap size={14} />
            {insights.teamSuggestions.length} suggestions ready
          </div>
        </div>
      </div>

      {/* Suggestion Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-xl)' }}>
        {insights.teamSuggestions.map((s, i) => (
          <button key={s.id} className={`tab ${activeIdx === i ? 'active' : ''}`} onClick={() => setActiveIdx(i)}>
            {s.projectType.split(' ').slice(0, 2).join(' ')}...
          </button>
        ))}
      </div>

      {/* Main Suggestion */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Project Info */}
        <div className="ai-card animate-fade">
          <div className="ai-label">
            <Brain size={14} />
            Project Requirements
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
            {suggestion.projectType}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
            {suggestion.description}
          </p>
          <div className="grid-2">
            {[
              { label: 'AI Confidence', val: `${suggestion.confidence}%`, color: '#10b981' },
              { label: 'Skill Coverage', val: `${suggestion.skillCoverage}%`, color: '#6366f1' },
              { label: 'Duration', val: suggestion.estimatedDuration, color: '#06b6d4' },
              { label: 'Risk Level', val: suggestion.riskLevel, color: suggestion.riskLevel === 'low' ? '#10b981' : '#f59e0b' },
            ].map((s) => (
              <div key={s.label} style={{ padding: '12px', background: 'rgba(6,182,212,0.05)', borderRadius: 10, border: '1px solid rgba(6,182,212,0.1)' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Confidence Bar */}
          <div style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>AI Confidence Score</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>{suggestion.confidence}%</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${suggestion.confidence}%`, background: 'var(--gradient-ai)' }} />
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="card animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
            <Brain size={18} color="var(--accent)" />
            <div className="section-title">AI Reasoning</div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.8 }}>
            {suggestion.reasoning}
          </p>
        </div>
      </div>

      {/* Suggested Team */}
      <div className="card animate-fade">
        <div className="section-header">
          <div>
            <div className="section-title">Recommended Team · {teamMembers.length} Members</div>
            <div className="section-subtitle">AI-selected based on skills, availability, and project fit</div>
          </div>
        </div>
        <div className="grid-auto">
          {teamMembers.map((emp) => {
            const skillCoverage = Math.min(100, Math.round(60 + Math.random() * 35));
            return (
              <div
                key={emp.id}
                style={{
                  padding: 'var(--space-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => navigate(`/${tenantId}/employees/${emp.id}`)}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>
                    {emp.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Project Fit</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>{skillCoverage}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${skillCoverage}%`, background: 'var(--gradient-success)' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {emp.skills.slice(0, 3).map((s) => <span key={s} className="skill-tag" style={{ fontSize: 10 }}>{s}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
