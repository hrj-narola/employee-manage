import { useState, useEffect } from 'react';

/**
 * Persists per-employee attendance marks in localStorage.
 * Storage key: nexahr_att_{tenantId}_{employeeId}
 * Format: { 'YYYY-MM-DD': 'present' | 'absent' | 'late' | 'half_day' }
 */
export function useAttendanceMarking(tenantId, employeeId) {
  const storageKey = `nexahr_att_${tenantId}_${employeeId}`;

  const [markedDays, setMarkedDays] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(markedDays));
  }, [markedDays, storageKey]);

  const markDay = (dateStr, status) => {
    setMarkedDays((prev) => ({ ...prev, [dateStr]: status }));
  };

  const unmarkDay = (dateStr) => {
    setMarkedDays((prev) => {
      const next = { ...prev };
      delete next[dateStr];
      return next;
    });
  };

  const todayStr = () => new Date().toISOString().split('T')[0];

  const todayStatus = markedDays[todayStr()] || null;

  /** Get last N days as array of { dateStr, label, dayOfWeek, status, isToday, isWeekend } */
  const getRecentDays = (n = 30) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dow = d.getDay(); // 0=Sun, 6=Sat
      days.push({
        dateStr,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow],
        status: markedDays[dateStr] || null,
        isToday: dateStr === todayStr(),
        isWeekend: dow === 0 || dow === 6,
      });
    }
    return days;
  };

  return { markedDays, markDay, unmarkDay, todayStatus, todayStr, getRecentDays };
}
