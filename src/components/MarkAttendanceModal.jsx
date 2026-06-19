import { useState } from 'react';
import { X, CheckCircle, XCircle, Clock, Minus } from 'lucide-react';
import { useAttendanceMarking } from '../hooks/useAttendanceMarking';

const STATUS_CONFIG = {
  present: {
    label: 'Present',
    icon: <CheckCircle size={16} />,
    color: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    border: 'rgba(5,150,105,0.25)',
    dotColor: '#059669',
  },
  late: {
    label: 'Late',
    icon: <Clock size={16} />,
    color: '#d97706',
    bg: 'rgba(217,119,6,0.08)',
    border: 'rgba(217,119,6,0.25)',
    dotColor: '#d97706',
  },
  half_day: {
    label: 'Half Day',
    icon: <Minus size={16} />,
    color: '#0284c7',
    bg: 'rgba(2,132,199,0.08)',
    border: 'rgba(2,132,199,0.25)',
    dotColor: '#0284c7',
  },
  absent: {
    label: 'Absent',
    icon: <XCircle size={16} />,
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.06)',
    border: 'rgba(220,38,38,0.2)',
    dotColor: '#dc2626',
  },
};

export default function MarkAttendanceModal({ tenantId, employeeId, employeeName, onClose }) {
  const { todayStatus, markDay, getRecentDays, todayStr } = useAttendanceMarking(tenantId, employeeId);
  const [selected, setSelected] = useState(todayStatus);
  const [saved, setSaved] = useState(!!todayStatus);

  const recentDays = getRecentDays(21); // last 21 days
  const today = todayStr();

  const handleMark = (status) => {
    setSelected(status);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    markDay(today, selected);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  const getDotStyle = (status) => {
    if (!status) return { background: 'var(--border-default)' };
    return { background: STATUS_CONFIG[status]?.dotColor || 'var(--border-default)' };
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 'var(--space-lg)',
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', zIndex: 301,
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 560,
          background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.2s ease',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Mark Attendance
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
              {employeeName} · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 7, cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Today's Status */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Today's Status
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  id={`att-status-${key}`}
                  onClick={() => handleMark(key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '14px 8px',
                    background: selected === key ? cfg.bg : 'var(--bg-elevated)',
                    border: `1.5px solid ${selected === key ? cfg.border : 'var(--border-subtle)'}`,
                    borderRadius: 12,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    color: selected === key ? cfg.color : 'var(--text-muted)',
                  }}
                >
                  <div style={{ color: selected === key ? cfg.color : 'var(--text-muted)' }}>
                    {cfg.icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent 21-Day Calendar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
              Recent History · Last 21 Days
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {/* Day labels */}
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--text-disabled)', paddingBottom: 4 }}>{d}</div>
              ))}
              {/* Spacer for first week alignment */}
              {(() => {
                const firstDay = recentDays[0];
                const firstDow = new Date(firstDay.dateStr).getDay();
                return Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`sp-${i}`} />
                ));
              })()}
              {recentDays.map((day) => {
                const cfg = day.status ? STATUS_CONFIG[day.status] : null;
                return (
                  <div
                    key={day.dateStr}
                    title={`${day.label}: ${cfg?.label || 'Not marked'}`}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 8,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                      background: day.isToday
                        ? (selected ? STATUS_CONFIG[selected]?.bg : 'var(--bg-elevated)')
                        : day.status ? `${cfg?.bg}` : day.isWeekend ? 'transparent' : 'var(--bg-elevated)',
                      border: day.isToday
                        ? `2px solid ${selected ? STATUS_CONFIG[selected]?.border : 'var(--accent)'}`
                        : '1px solid transparent',
                      position: 'relative',
                      opacity: day.isWeekend && !day.status ? 0.4 : 1,
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: day.isToday ? 700 : 500, color: day.isToday ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {new Date(day.dateStr).getDate()}
                    </span>
                    {(day.status || (day.isToday && selected)) && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: day.isToday ? STATUS_CONFIG[selected]?.dotColor : cfg?.dotColor,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              {Object.entries(STATUS_CONFIG).map(([k, cfg]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dotColor }} />
                  {cfg.label}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              id="save-attendance-btn"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!selected || saved}
              style={{ opacity: (!selected || saved) ? 0.7 : 1, minWidth: 120, justifyContent: 'center' }}
            >
              {saved ? (
                <>
                  <CheckCircle size={15} />
                  Saved!
                </>
              ) : 'Save Attendance'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
