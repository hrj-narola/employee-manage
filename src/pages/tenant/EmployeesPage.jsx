import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Users, TrendingUp, TrendingDown, Minus, Shield, Eye, EyeOff } from 'lucide-react';
import { getEmployeesByTenant } from '../../data/employees';
import { useEmployeeAccess } from '../../hooks/useEmployeeAccess';

const DEPT_COLORS = {
  Engineering: '#6366f1',
  Product: '#06b6d4',
  Design: '#8b5cf6',
  HR: '#10b981',
  Executive: '#f59e0b',
  Sales: '#ef4444',
};

const TrendIcon = ({ trend }) => {
  if (trend === 'up') return <TrendingUp size={14} color="#10b981" />;
  if (trend === 'down') return <TrendingDown size={14} color="#ef4444" />;
  return <Minus size={14} color="var(--text-muted)" />;
};

/** Card shown to regular employees — basic info only (no scores, no AI) */
function BasicTeamCard({ emp, onClick }) {
  return (
    <div
      className="employee-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
        <div
          className="emp-avatar"
          style={{
            background: `linear-gradient(135deg, ${DEPT_COLORS[emp.department] || '#6366f1'} 0%, ${DEPT_COLORS[emp.department] || '#8b5cf6'}99 100%)`,
          }}
        >
          {emp.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{emp.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{emp.jobTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
              background: `${DEPT_COLORS[emp.department] || '#6366f1'}22`,
              color: DEPT_COLORS[emp.department] || '#6366f1',
            }}>
              {emp.department}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.level}</span>
          </div>
        </div>
      </div>

      {/* Basic attendance only */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6,
        padding: '10px 0', borderTop: '1px solid var(--border-subtle)',
      }}>
        {[
          { label: 'Attendance', val: `${emp.attendanceRate}%` },
          { label: 'Experience', val: `${emp.experience}y` },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Skills — visible for team members */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {emp.skills.slice(0, 3).map((s) => <span key={s} className="skill-tag">{s}</span>)}
        {emp.skills.length > 3 && (
          <span className="skill-tag" style={{ color: 'var(--text-muted)' }}>+{emp.skills.length - 3}</span>
        )}
      </div>

      {/* Restricted indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
        <EyeOff size={11} />
        Performance details restricted
      </div>
    </div>
  );
}

/** Full card shown to admins/HR/managers */
function FullEmployeeCard({ emp, onClick }) {
  return (
    <div className="employee-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
        <div
          className="emp-avatar"
          style={{
            background: `linear-gradient(135deg, ${DEPT_COLORS[emp.department] || '#6366f1'} 0%, ${DEPT_COLORS[emp.department] || '#8b5cf6'}99 100%)`,
          }}
        >
          {emp.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>{emp.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{emp.jobTitle}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
              background: `${DEPT_COLORS[emp.department] || '#6366f1'}22`,
              color: DEPT_COLORS[emp.department] || '#6366f1',
            }}>
              {emp.department}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{emp.level}</span>
          </div>
        </div>
        <TrendIcon trend={emp.aiInsight.trend} />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Performance</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{emp.performanceScore}/100</span>
        </div>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar-fill"
            style={{
              width: `${emp.performanceScore}%`,
              background: emp.performanceScore >= 90 ? 'var(--gradient-success)' : emp.performanceScore >= 75 ? 'var(--gradient-brand)' : 'var(--gradient-warm)',
            }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
        padding: '10px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)',
      }}>
        {[
          { label: 'Attendance', val: `${emp.attendanceRate}%` },
          { label: 'Projects', val: emp.projectsCompleted },
          { label: 'Exp.', val: `${emp.experience}y` },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {emp.skills.slice(0, 3).map((s) => <span key={s} className="skill-tag">{s}</span>)}
        {emp.skills.length > 3 && <span className="skill-tag" style={{ color: 'var(--text-muted)' }}>+{emp.skills.length - 3}</span>}
      </div>

      <div style={{
        padding: '8px 10px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
        borderRadius: 8, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5,
      }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>AI: </span>
        {emp.aiInsight.summary.length > 80 ? emp.aiInsight.summary.substring(0, 80) + '...' : emp.aiInsight.summary}
      </div>
    </div>
  );
}

export default function EmployeesPage() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const access = useEmployeeAccess(tenantId);
  const allEmployees = getEmployeesByTenant(tenantId);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [sortBy, setSortBy] = useState('performanceScore');

  // Determine which employees this user can see
  let visibleEmployees;
  let pageTitle;
  let pageSubtitle;

  if (access.canSeeAll) {
    // Admin / HR / Tenant Admin → see all
    visibleEmployees = allEmployees;
    pageTitle = 'Employees';
    pageSubtitle = `${allEmployees.length} team members`;
  } else if (access.isManager) {
    // Manager employee → sees their direct reports only
    visibleEmployees = access.myTeam; // myTeam = directReports for managers
    pageTitle = 'My Team';
    pageSubtitle = `${access.myTeam.length} direct reports`;
  } else {
    // Regular employee → sees teammates (same manager, no self)
    visibleEmployees = access.myTeam;
    pageTitle = 'My Team';
    pageSubtitle = access.myTeam.length > 0
      ? `${access.myTeam.length} teammate${access.myTeam.length !== 1 ? 's' : ''} · basic info only`
      : 'No teammates found';
  }

  const departments = [...new Set(visibleEmployees.map((e) => e.department))];

  const filtered = visibleEmployees
    .filter((e) => {
      const q = search.toLowerCase();
      const matchesSearch =
        e.name.toLowerCase().includes(q) ||
        e.jobTitle.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q));
      const matchesDept = deptFilter === 'all' || e.department === deptFilter;
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'performanceScore') return b.performanceScore - a.performanceScore;
      if (sortBy === 'attendanceRate') return b.attendanceRate - a.attendanceRate;
      return 0;
    });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">{pageTitle}</h1>
            <p className="page-subtitle">{pageSubtitle}</p>
          </div>
          {/* Access Level Indicator */}
          {access.isEmployee && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px',
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--border-default)',
              borderRadius: 10,
              fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
            }}>
              <Shield size={13} color="var(--accent)" />
              {access.isManager ? 'Manager View — Full Team Details' : 'Member View — Basic Details Only'}
            </div>
          )}
        </div>
      </div>

      {/* Empty state for employee with no team */}
      {access.isEmployee && visibleEmployees.length === 0 && (
        <div className="empty-state">
          <Users size={48} color="var(--text-disabled)" />
          <h3 style={{ color: 'var(--text-secondary)' }}>No teammates found</h3>
          <p>You're not assigned to a team yet. Contact your HR manager.</p>
        </div>
      )}

      {visibleEmployees.length > 0 && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: '1 1 240px' }}>
              <Search size={15} className="search-icon" />
              <input
                id="employee-search"
                className="form-input"
                style={{ paddingLeft: 40 }}
                placeholder={access.isEmployee ? 'Search teammates...' : 'Search by name, role, skill...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {departments.length > 1 && (
              <select
                id="dept-filter"
                className="form-select"
                style={{ width: 180 }}
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            )}
            <select
              id="sort-select"
              className="form-select"
              style={{ width: 160 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {!access.isEmployee && <option value="performanceScore">Sort: Performance</option>}
              <option value="attendanceRate">Sort: Attendance</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          {/* Employee Grid */}
          <div className="grid-auto stagger">
            {filtered.map((emp) =>
              // Regular employees see basic card; managers/admins see full card
              (access.isEmployee && !access.isManager) ? (
                <BasicTeamCard
                  key={emp.id}
                  emp={emp}
                  onClick={() => navigate(`/${tenantId}/employees/${emp.id}`)}
                />
              ) : (
                <FullEmployeeCard
                  key={emp.id}
                  emp={emp}
                  onClick={() => navigate(`/${tenantId}/employees/${emp.id}`)}
                />
              )
            )}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <Users size={48} color="var(--text-disabled)" />
              <h3 style={{ color: 'var(--text-secondary)' }}>No results</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
