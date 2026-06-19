import { useParams, useNavigate } from 'react-router-dom';
import { FolderKanban, Users, Calendar, DollarSign, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';
import { getProjectsByTenant } from '../../data/projects';
import { getEmployeesByTenant } from '../../data/employees';

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  high: { label: 'High', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  medium: { label: 'Medium', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  low: { label: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export default function ProjectsPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const projects = getProjectsByTenant(tenantId);
  const employees = getEmployeesByTenant(tenantId);

  const getEmployee = (id) => employees.find((e) => e.id === id);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">{activeProjects.length} active · {completedProjects.length} completed</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Projects', val: projects.length, icon: <FolderKanban size={20} color="#6366f1" />, iconBg: 'rgba(99,102,241,0.12)' },
          { label: 'Active', val: activeProjects.length, icon: <Clock size={20} color="#06b6d4" />, iconBg: 'rgba(6,182,212,0.12)' },
          { label: 'Total Budget', val: `$${(totalBudget / 1000).toFixed(0)}K`, icon: <DollarSign size={20} color="#10b981" />, iconBg: 'rgba(16,185,129,0.12)' },
          { label: 'Budget Used', val: `${Math.round((totalSpent / totalBudget) * 100)}%`, icon: <ArrowUpRight size={20} color="#f59e0b" />, iconBg: 'rgba(245,158,11,0.12)' },
        ].map((s) => (
          <div key={s.label} className="stat-card animate-fade">
            <div className="stat-icon" style={{ background: s.iconBg }}>{s.icon}</div>
            <div className="stat-value">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active Projects */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="section-header">
          <div>
            <div className="section-title">Active Projects</div>
            <div className="section-subtitle">Currently in progress</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {activeProjects.map((p, i) => {
            const priority = PRIORITY_CONFIG[p.priority];
            const budgetUsedPct = Math.round((p.spent / p.budget) * 100);
            const teamMembers = p.team.slice(0, 4).map(getEmployee).filter(Boolean);

            return (
              <div
                key={p.id}
                className="card animate-fade"
                style={{ cursor: 'pointer', animationDelay: `${i * 60}ms` }}
                onClick={() => {}}
              >
                <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                  {/* Left: Project Info */}
                  <div style={{ flex: 2, minWidth: 280 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 8 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px',
                        background: priority.bg, color: priority.color, borderRadius: 99,
                      }}>
                        {priority.label}
                      </span>
                      <span className={`badge badge-${p.healthScore >= 80 ? 'success' : p.healthScore >= 65 ? 'warning' : 'danger'}`}>
                        {p.healthScore}% Health
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                      {p.description}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-lg)', fontSize: 12, color: 'var(--text-muted)' }}>
                      <span><Calendar size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{p.endDate}</span>
                      <span><Users size={11} style={{ marginRight: 4, verticalAlign: 'middle' }} />{p.teamSize} members</span>
                    </div>
                  </div>

                  {/* Middle: Progress */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.progress}%</span>
                      </div>
                      <div className="progress-bar-wrap" style={{ height: 8 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${p.progress}%`,
                          background: p.progress > 70 ? 'var(--gradient-success)' : 'var(--gradient-brand)',
                        }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Budget</span>
                        <span style={{ fontWeight: 700, color: budgetUsedPct > 90 ? '#ef4444' : 'var(--text-primary)' }}>{budgetUsedPct}%</span>
                      </div>
                      <div className="progress-bar-wrap" style={{ height: 8 }}>
                        <div className="progress-bar-fill" style={{
                          width: `${budgetUsedPct}%`,
                          background: budgetUsedPct > 90 ? 'var(--gradient-warm)' : 'var(--gradient-ai)',
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        ${(p.spent / 1000).toFixed(0)}K of ${(p.budget / 1000).toFixed(0)}K
                      </div>
                    </div>

                    {/* Team Avatars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
                      <div style={{ display: 'flex' }}>
                        {teamMembers.map((m, idx) => (
                          <div key={m.id} style={{
                            width: 28, height: 28,
                            borderRadius: 8,
                            background: 'var(--gradient-brand)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 700, color: 'white',
                            border: '2px solid var(--bg-card)',
                            marginLeft: idx > 0 ? -8 : 0,
                            zIndex: teamMembers.length - idx,
                          }}>
                            {m.avatar}
                          </div>
                        ))}
                        {p.team.length > 4 && (
                          <div style={{
                            width: 28, height: 28,
                            borderRadius: 8,
                            background: 'var(--bg-elevated)',
                            border: '2px solid var(--bg-card)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 9, fontWeight: 700, color: 'var(--text-muted)',
                            marginLeft: -8,
                          }}>
                            +{p.team.length - 4}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Milestones */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                      Milestones
                    </div>
                    <div className="milestone-list">
                      {p.milestones.slice(0, 4).map((m) => (
                        <div key={m.name} className="milestone-item">
                          <div className={`milestone-dot ${m.completed ? 'done' : 'pending'}`} />
                          <span style={{ color: m.completed ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 12 }}>
                            {m.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
                      {p.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="skill-tag" style={{ fontSize: 10 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Completed Projects</div>
            </div>
          </div>
          <div className="grid-2">
            {completedProjects.map((p) => (
              <div key={p.id} className="card" style={{ opacity: 0.8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981', fontSize: 12, fontWeight: 600 }}>
                    <CheckCircle size={13} /> Completed
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.description}</p>
                <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  Budget: ${(p.spent / 1000).toFixed(0)}K of ${(p.budget / 1000).toFixed(0)}K used
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
