import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Briefcase, TrendingUp, TrendingDown, Minus, Brain, Star, CheckCircle, Lock, Plus } from 'lucide-react';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { getEmployeesByTenant } from '../../data/employees';
import { getAttendance } from '../../data/attendance';
import { getProjectsByTenant } from '../../data/projects';
import { useEmployeeAccess, canViewEmployee } from '../../hooks/useEmployeeAccess';
import MarkAttendanceModal from '../../components/MarkAttendanceModal';

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

export default function EmployeeDetailPage() {
  const { tenantId, employeeId } = useParams();
  const navigate = useNavigate();
  const access = useEmployeeAccess(tenantId);
  const employees = getEmployeesByTenant(tenantId);
  const emp = employees.find((e) => e.id === employeeId);
  const attendance = getAttendance(tenantId, employeeId);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const allProjects = getProjectsByTenant(tenantId);
  const empProjects = allProjects.filter((p) => p.team.includes(employeeId));

  if (!emp) return (
    <div className="empty-state">
      <h3>Employee not found</h3>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  // Access control: regular employees can only see basic info for teammates
  const isViewingSelf = access.myEmployee?.id === employeeId;
  const isManagerViewingReport = access.isManager && access.myTeam.some((e) => e.id === employeeId);
  const canSeeFullDetails = access.canSeeAll || isViewingSelf || isManagerViewingReport;

  // Block access entirely if this employee is not in user's visible set
  if (access.isEmployee && !canViewEmployee(access, employeeId)) {
    return (
      <div className="empty-state">
        <Lock size={48} color="var(--text-disabled)" />
        <h3 style={{ color: 'var(--text-secondary)' }}>Access Restricted</h3>
        <p>You can only view profiles of your teammates.</p>
        <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const TrendIcon = ({ trend }) => {
    if (trend === 'up') return <TrendingUp size={16} color="#10b981" />;
    if (trend === 'down') return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="var(--text-muted)" />;
  };

  const perfColor = emp.performanceScore >= 90 ? '#10b981' : emp.performanceScore >= 75 ? '#6366f1' : '#f59e0b';

  const radialData = [
    { name: 'Performance', value: emp.performanceScore, fill: '#6366f1' },
  ];

  return (
    <div className="animate-fade">
      {/* Back and Mark buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0 }}
          onClick={() => navigate(`/${tenantId}/employees`)}
        >
          <ArrowLeft size={15} /> Back to Employees
        </button>
        {canSeeFullDetails && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowMarkModal(true)}
            id="detail-mark-attendance-btn"
          >
            <Plus size={14} /> Mark Attendance
          </button>
        )}
      </div>

      {/* Employee Hero */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72,
            borderRadius: 16,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 800, color: 'white',
            flexShrink: 0,
            boxShadow: '0 0 24px rgba(99,102,241,0.3)',
          }}>
            {emp.avatar}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 700 }}>
                {emp.name}
              </h1>
              <TrendIcon trend={emp.aiInsight.trend} />
              <span className={`badge badge-${emp.status === 'active' ? 'success' : 'warning'}`}>
                {emp.status}
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>{emp.jobTitle} · {emp.department} · {emp.level}</div>
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <MapPin size={13} /> {emp.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <Calendar size={13} /> Joined {new Date(emp.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <Briefcase size={13} /> {emp.experience} years experience
              </div>
            </div>
          </div>

          {/* Score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" barSize={10} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: 'rgba(99,102,241,0.08)' }} dataKey="value" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: perfColor, lineHeight: 1 }}>
                  {emp.performanceScore}
                </span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>SCORE</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Performance</span>
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {emp.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
        {[
          { label: 'Attendance Rate', val: `${emp.attendanceRate}%`, color: emp.attendanceRate >= 95 ? '#10b981' : emp.attendanceRate >= 88 ? '#f59e0b' : '#ef4444' },
          { label: 'Projects Done', val: emp.projectsCompleted, color: '#6366f1' },
          // Salary only visible to self, manager, or admin
          ...(canSeeFullDetails ? [{ label: 'Current Salary', val: `$${emp.salary.toLocaleString()}`, color: '#0284c7' }] : [{ label: 'Level', val: emp.level, color: 'var(--text-secondary)' }]),
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
        {/* Attendance Chart */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Attendance History</div>
              <div className="section-subtitle">Last 6 months</div>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 22]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="present" name="Present Days" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.85} />
                <Bar dataKey="absent" name="Absent Days" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Projects */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Projects</div>
              <div className="section-subtitle">{empProjects.length} assigned</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {empProjects.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 'var(--space-xl)' }}>
                No projects assigned
              </div>
            ) : empProjects.map((p) => (
              <div key={p.id} style={{
                padding: '12px 14px',
                background: 'var(--bg-elevated)',
                borderRadius: 10,
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                  <span className={`badge badge-${p.status === 'active' ? 'info' : 'success'}`}>{p.status}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${p.progress}%`, background: 'var(--gradient-brand)' }} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>{p.progress}% complete</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight — only for self, manager, or admin */}
      {canSeeFullDetails ? (
        <div className="ai-card animate-fade">
          <div className="ai-label">
            <Brain size={14} />
            AI Performance Analysis
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 14, lineHeight: 1.7, marginBottom: 'var(--space-lg)' }}>
            {emp.aiInsight.summary}
          </p>
          <div className="grid-3">
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Strengths</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {emp.aiInsight.strengths.map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <CheckCircle size={13} color="#10b981" />
                    <span style={{ color: 'var(--text-primary)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Areas to Improve</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {emp.aiInsight.improvements.map((s) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    <Star size={13} color="#f59e0b" />
                    <span style={{ color: 'var(--text-secondary)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Increment Recommendation</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                borderRadius: 10, fontSize: 20, fontWeight: 800,
                color: 'var(--accent)', fontFamily: "'Space Grotesk', sans-serif",
              }}>
                +{emp.aiInsight.incrementRecommendation}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Suggested annual increment</div>
            </div>
          </div>
        </div>
      ) : (
        /* Basic employees see a restricted notice instead of AI insights */
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'var(--space-lg)' }}>
          <Lock size={20} color="var(--text-disabled)" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Performance details are restricted</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>AI insights, increment data, and scores are visible to managers and HR only.</div>
          </div>
        </div>
      )}
      {showMarkModal && (
        <MarkAttendanceModal
          tenantId={tenantId}
          employeeId={employeeId}
          employeeName={emp.name}
          onClose={() => setShowMarkModal(false)}
        />
      )}
    </div>
  );
}
