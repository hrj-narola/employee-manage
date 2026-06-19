import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line
} from 'recharts';
import { getEmployeesByTenant } from '../../data/employees';
import { getAttendance } from '../../data/attendance';
import { CalendarCheck, AlertTriangle, TrendingUp, Users, Shield, Plus, Lock, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmployeeAccess } from '../../hooks/useEmployeeAccess';
import { useAttendanceMarking } from '../../hooks/useAttendanceMarking';
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

const STATUS_COLORS = {
  present: { color: '#059669', bg: 'rgba(5,150,105,0.08)', icon: <CheckCircle size={14} /> },
  late: { color: '#d97706', bg: 'rgba(217,119,6,0.08)', icon: <Clock size={14} /> },
  half_day: { color: '#0284c7', bg: 'rgba(2,132,199,0.08)', icon: <Minus size={14} /> },
  absent: { color: '#dc2626', bg: 'rgba(220,38,38,0.06)', icon: <XCircle size={14} /> },
};

export default function AttendancePage() {
  const { tenantId } = useParams();
  const { user } = useAuth();
  const access = useEmployeeAccess(tenantId);
  const allEmployees = getEmployeesByTenant(tenantId);

  // Modal State
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markEmpId, setMarkEmpId] = useState(null);
  const [markEmpName, setMarkEmpName] = useState('');

  const isRegularEmployee = access.isEmployee && !access.isManager;
  const isManager = access.isEmployee && access.isManager;
  const isAdminOrHR = access.canSeeAll;

  // Selected employee for personal tracking (e.g. self)
  const myEmployee = allEmployees.find((e) => e.id === user?.employeeId);
  
  // Custom hook for current employee's daily marking overview
  const { getRecentDays, todayStatus } = useAttendanceMarking(tenantId, myEmployee?.id || '');
  const last7Days = getRecentDays(7);

  // Employees list visible on this page:
  // - Admin/HR: all employees
  // - Manager: reports (myTeam)
  // - Regular Employee: teammates (myTeam)
  const visibleEmployees = isAdminOrHR
    ? allEmployees
    : access.myTeam; // for managers this is reports, for regular employees this is teammates

  // Map and aggregate attendance data
  const getAggregatedData = (empList) => {
    return empList.map((emp) => {
      const att = getAttendance(tenantId, emp.id);
      const totalPresent = att.reduce((s, m) => s + m.present, 0);
      const totalDays = att.reduce((s, m) => s + m.total, 0);
      return {
        ...emp,
        attendance: att,
        totalPresent,
        totalDays,
        overallRate: totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : emp.attendanceRate,
      };
    });
  };

  const employeeAttendance = getAggregatedData(visibleEmployees);

  // Self attendance metrics (if applicable)
  const myAttendance = myEmployee ? getAttendance(tenantId, myEmployee.id) : [];
  const myTotalPresent = myAttendance.reduce((s, m) => s + m.present, 0);
  const myTotalDays = myAttendance.reduce((s, m) => s + m.total, 0);
  const myOverallRate = myTotalDays > 0 ? Math.round((myTotalPresent / myTotalDays) * 100) : (myEmployee?.attendanceRate || 0);

  // Aggregated summaries for dashboards
  let avgAttendance = 0;
  let excellentCount = 0;
  let atRiskCount = 0;

  if (isAdminOrHR || isManager) {
    const listToCalc = employeeAttendance;
    avgAttendance = listToCalc.length > 0 
      ? Math.round(listToCalc.reduce((s, e) => s + e.overallRate, 0) / listToCalc.length) 
      : 100;
    excellentCount = listToCalc.filter((e) => e.overallRate >= 97).length;
    atRiskCount = listToCalc.filter((e) => e.overallRate < 90).length;
  }

  // Monthly trend calculations (based on visible list or self)
  const months = (isAdminOrHR || isManager)
    ? (employeeAttendance[0]?.attendance?.map((m) => m.month) || [])
    : (myAttendance.map((m) => m.month) || []);

  const monthlyTrend = months.map((month, idx) => {
    if (isAdminOrHR || isManager) {
      const avgRate = employeeAttendance.length > 0
        ? Math.round(employeeAttendance.reduce((s, e) => s + (e.attendance[idx]?.rate || 0), 0) / employeeAttendance.length)
        : 100;
      return { month: month.split(' ')[0], rate: avgRate };
    } else {
      const rate = myAttendance[idx]?.rate || 100;
      return { month: month.split(' ')[0], rate };
    }
  });

  const handleOpenMarkModal = (empId, empName) => {
    setMarkEmpId(empId);
    setMarkEmpName(empName);
    setShowMarkModal(true);
  };

  return (
    <div>
      {/* ───── REGULAR EMPLOYEE VIEW ───── */}
      {isRegularEmployee && myEmployee && (
        <div className="animate-fade">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-top">
              <div>
                <h1 className="page-title">My Attendance</h1>
                <p className="page-subtitle">Track your status, daily check-ins, and view team list</p>
              </div>
              <div className="page-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleOpenMarkModal(myEmployee.id, myEmployee.name)}
                >
                  <Plus size={16} /> Mark Today's Attendance
                </button>
              </div>
            </div>
          </div>

          {/* Stats & Current Check-in Status */}
          <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Stats Summary */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                Personal Performance Summary
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-lg)' }}>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: myOverallRate >= 95 ? 'var(--success)' : myOverallRate >= 90 ? 'var(--accent)' : 'var(--danger)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {myOverallRate}%
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Attendance Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {myTotalPresent} <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>/ {myTotalDays}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Present / Working Days</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
                    {myOverallRate >= 95 ? 'Excellent' : myOverallRate >= 90 ? 'Satisfactory' : 'Needs Review'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Irregularity Risk Status</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>
                    {todayStatus ? STATUS_COLORS[todayStatus]?.icon : '-'} {todayStatus ? todayStatus.toUpperCase() : 'NOT MARKED'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today's Status</div>
                </div>
              </div>
            </div>

            {/* Quick 7-Day Activity Feed */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Recent activity · Last 7 days
                </div>
                <span className="badge badge-default">Current Week</span>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', margin: '20px 0' }}>
                {last7Days.map((day) => (
                  <div key={day.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{day.dayOfWeek}</span>
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: 10,
                      background: day.status ? STATUS_COLORS[day.status].bg : 'var(--bg-elevated)',
                      border: day.isToday ? '2px solid var(--accent)' : '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: day.status ? STATUS_COLORS[day.status].color : 'var(--text-disabled)',
                    }}>
                      {day.status ? STATUS_COLORS[day.status].icon : '-'}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-disabled)' }}>{new Date(day.dateStr).getDate()}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: 'var(--text-muted)' }}>
                {Object.entries(STATUS_COLORS).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: value.color }} />
                    {key.replace('_', ' ').toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Personal Chart */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
            <div className="section-header">
              <div>
                <div className="section-title">My Monthly Attendance Trend</div>
                <div className="section-subtitle">Last 6 months progression</div>
              </div>
            </div>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="rate" name="Attendance %" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Teammates List (Basic Attendance Details only) */}
          <div className="card animate-fade">
            <div className="section-header">
              <div>
                <div className="section-title">Teammate Directory</div>
                <div className="section-subtitle">Basic attendance rates for your team members</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teammate</th>
                  <th>Department</th>
                  <th>Attendance Rate</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)' }}>
                      No teammates found.
                    </td>
                  </tr>
                ) : (
                  employeeAttendance
                    .sort((a, b) => b.overallRate - a.overallRate)
                    .map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                              {emp.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.jobTitle}</div>
                            </div>
                          </div>
                        </td>
                        <td>{emp.department}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, maxWidth: 60 }}>
                              <div className="progress-bar-wrap">
                                <div className="progress-bar-fill" style={{
                                  width: `${emp.overallRate}%`,
                                  background: emp.overallRate >= 95 ? 'var(--gradient-success)' : emp.overallRate >= 88 ? 'var(--gradient-brand)' : 'var(--gradient-warm)',
                                }} />
                              </div>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                              {emp.overallRate}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge badge-${emp.overallRate >= 95 ? 'success' : emp.overallRate >= 88 ? 'warning' : 'danger'}`}>
                            {emp.overallRate >= 95 ? 'Excellent' : emp.overallRate >= 88 ? 'Average' : 'Concern'}
                          </span>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'var(--space-md)', padding: 10, background: 'var(--bg-elevated)', borderRadius: 10, border: '1.5px dashed var(--border-default)' }}>
              <Lock size={14} color="var(--text-disabled)" />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Detailed monthly summaries, performance score correlations, and AI trends are hidden for peer safety.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ───── MANAGER & ADMIN VIEW ───── */}
      {(!isRegularEmployee) && (
        <div className="animate-fade">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-top">
              <div>
                <h1 className="page-title">{isManager ? 'Team Attendance' : 'Attendance Overview'}</h1>
                <p className="page-subtitle">
                  {isManager 
                    ? 'Track reports attendance rates, irregularities, and adjust check-ins'
                    : 'Organizational attendance tracking and irregularity analysis'
                  }
                </p>
              </div>
              <div className="page-actions">
                {/* Shield badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 14px',
                  background: 'var(--bg-elevated)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 10,
                  fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)',
                  marginRight: 6
                }}>
                  <Shield size={13} color="var(--accent)" />
                  {isManager ? 'Manager Dashboard' : 'Admin Dashboard'}
                </div>
                {/* Button to mark self attendance */}
                {myEmployee && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleOpenMarkModal(myEmployee.id, myEmployee.name)}
                  >
                    Mark My Attendance
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-xl)' }}>
            {[
              { label: 'Avg Attendance Rate', val: `${avgAttendance}%`, icon: <CalendarCheck size={20} color="#10b981" />, bg: 'rgba(16,185,129,0.12)' },
              { label: 'Perfect Attendance', val: excellentCount, icon: <TrendingUp size={20} color="#06b6d4" />, bg: 'rgba(6,182,212,0.12)' },
              { label: 'Below 90%', val: atRiskCount, icon: <AlertTriangle size={20} color="#f59e0b" />, bg: 'rgba(245,158,11,0.12)' },
              { label: isManager ? 'Direct Reports' : 'Total Employees', val: employeeAttendance.length, icon: <Users size={20} color="#6366f1" />, bg: 'rgba(99,102,241,0.12)' },
            ].map((s) => (
              <div key={s.label} className="stat-card animate-fade">
                <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
                <div className="stat-value">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
            {/* Monthly Trend */}
            <div className="card animate-fade">
              <div className="section-header">
                <div>
                  <div className="section-title">Monthly Attendance Trend</div>
                  <div className="section-subtitle">{isManager ? 'Team average' : 'Organization-wide'} · last 6 months</div>
                </div>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[80, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employee Comparison */}
            <div className="card animate-fade">
              <div className="section-header">
                <div>
                  <div className="section-title">Member Attendance Rates</div>
                  <div className="section-subtitle">6-month average</div>
                </div>
              </div>
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={employeeAttendance.map((e) => ({ name: e.name.split(' ')[0], rate: e.overallRate }))}
                    margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                  >
                    <CartesianGrid stroke="rgba(99,102,241,0.06)" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[75, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="rate"
                      name="Attendance %"
                      radius={[4, 4, 0, 0]}
                      fill="#6366f1"
                      opacity={0.85}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="card animate-fade">
            <div className="section-header">
              <div>
                <div className="section-title">Individual Attendance Summary</div>
                <div className="section-subtitle">Sorted by attendance rate · Click 'Mark' to adjust status</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Rate</th>
                  <th>Trend</th>
                  {months.map((m) => (
                    <th key={m}>{m.split(' ')[0]}</th>
                  ))}
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeAttendance
                  .sort((a, b) => b.overallRate - a.overallRate)
                  .map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>
                            {emp.avatar}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, maxWidth: 60 }}>
                            <div className="progress-bar-wrap">
                              <div className="progress-bar-fill" style={{
                                width: `${emp.overallRate}%`,
                                background: emp.overallRate >= 95 ? 'var(--gradient-success)' : emp.overallRate >= 88 ? 'var(--gradient-brand)' : 'var(--gradient-warm)',
                              }} />
                            </div>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13 }}>
                            {emp.overallRate}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${emp.attendanceRate >= 95 ? 'success' : emp.attendanceRate >= 88 ? 'warning' : 'danger'}`}>
                          {emp.attendanceRate >= 95 ? '↑ Excellent' : emp.attendanceRate >= 88 ? '→ Average' : '↓ Concern'}
                        </span>
                      </td>
                      {emp.attendance.map((m) => (
                        <td key={m.month} style={{ textAlign: 'center' }}>
                          <span style={{
                            fontSize: 12, fontWeight: 600,
                            color: m.rate >= 95 ? '#10b981' : m.rate >= 88 ? '#f59e0b' : '#ef4444',
                          }}>
                            {m.present}/{m.total}
                          </span>
                        </td>
                      ))}
                      <td>
                        <span className={`badge badge-${emp.overallRate >= 95 ? 'success' : emp.overallRate >= 88 ? 'default' : 'danger'}`}>
                          {emp.overallRate >= 95 ? 'Good' : emp.overallRate >= 88 ? 'Average' : 'At Risk'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-ghost btn-sm"
                          id={`mark-btn-${emp.id}`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent row click navigate
                            handleOpenMarkModal(emp.id, emp.name);
                          }}
                          style={{ padding: '4px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--border-default)', background: 'var(--bg-card)' }}
                        >
                          Mark
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showMarkModal && (
        <MarkAttendanceModal
          tenantId={tenantId}
          employeeId={markEmpId}
          employeeName={markEmpName}
          onClose={() => setShowMarkModal(false)}
        />
      )}
    </div>
  );
}
