// Generates monthly attendance for the last 6 months
const generateAttendance = (rate, months = 6) => {
  const result = [];
  const now = new Date(); // Dynamic current date
  for (let m = months - 1; m >= 0; m--) {
    const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const workingDays = 22;
    const present = Math.round(workingDays * (rate / 100) + (Math.random() * 2 - 1));
    const clamped = Math.max(14, Math.min(workingDays, present));
    result.push({
      month: `${monthName} ${year}`,
      present: clamped,
      absent: workingDays - clamped,
      total: workingDays,
      rate: Math.round((clamped / workingDays) * 100),
    });
  }
  return result;
};

export const ATTENDANCE = {
  acme: {
    emp_acme_001: generateAttendance(98),
    emp_acme_002: generateAttendance(95),
    emp_acme_003: generateAttendance(93),
    emp_acme_004: generateAttendance(97),
    emp_acme_005: generateAttendance(91),
    emp_acme_006: generateAttendance(99),
    emp_acme_007: generateAttendance(88),
    emp_acme_008: generateAttendance(96),
  },
  techflow: {
    emp_tf_001: generateAttendance(97),
    emp_tf_002: generateAttendance(94),
    emp_tf_003: generateAttendance(96),
    emp_tf_004: generateAttendance(92),
    emp_tf_005: generateAttendance(98),
  },
  innovateco: {
    emp_ic_001: generateAttendance(99),
    emp_ic_002: generateAttendance(97),
    emp_ic_003: generateAttendance(98),
    emp_ic_004: generateAttendance(94),
  },
};

export const getAttendance = (tenantId, employeeId) => {
  const base = (ATTENDANCE[tenantId] || {})[employeeId] || [];
  
  // Read daily logs from localStorage
  const storageKey = `nexahr_att_${tenantId}_${employeeId}`;
  let localMarks = {};
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      localMarks = JSON.parse(stored);
    }
  } catch (e) {
    // ignore
  }

  if (Object.keys(localMarks).length === 0) {
    return base;
  }

  // Group daily logs by 'MMM YYYY'
  const monthlyLocal = {};
  Object.entries(localMarks).forEach(([dateStr, status]) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

    if (!monthlyLocal[monthKey]) {
      monthlyLocal[monthKey] = { present: 0, absent: 0, total: 0 };
    }

    if (status === 'present' || status === 'late') {
      monthlyLocal[monthKey].present += 1;
      monthlyLocal[monthKey].total += 1;
    } else if (status === 'half_day') {
      monthlyLocal[monthKey].present += 0.5;
      monthlyLocal[monthKey].total += 1;
    } else if (status === 'absent') {
      monthlyLocal[monthKey].absent += 1;
      monthlyLocal[monthKey].total += 1;
    }
  });

  // Override base month values with local values
  return base.map((m) => {
    const local = monthlyLocal[m.month];
    if (local && local.total > 0) {
      const present = Math.round(local.present);
      const absent = Math.round(local.absent);
      const total = local.total;
      return {
        month: m.month,
        present,
        absent,
        total,
        rate: total > 0 ? Math.round((present / total) * 100) : 100,
      };
    }
    return m;
  });
};
