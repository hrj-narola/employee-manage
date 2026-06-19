import { useAuth } from '../context/AuthContext';
import { getEmployeesByTenant } from '../data/employees';

/**
 * Determines what an employee-role user can access.
 * 
 * Rules:
 *  - super_admin / tenant_admin / hr_manager → full access, canSeeAll = true
 *  - employee who manages others (isManager) → can see their direct reports fully + all team details
 *  - regular employee → can only see their own data + basic info of teammates (same manager)
 */
export function useEmployeeAccess(tenantId) {
  const { user } = useAuth();

  const allEmployees = getEmployeesByTenant(tenantId);

  // Non-employee roles get full access
  if (!user || user.role !== 'employee') {
    return {
      isEmployee: false,
      isManager: false,
      myEmployee: null,
      myTeam: [],
      directReports: [],
      canSeeAll: true,
    };
  }

  const myEmployee = allEmployees.find((e) => e.id === user.employeeId) || null;

  // Direct reports: employees whose manager field matches this user's employeeId
  const directReports = allEmployees.filter((e) => e.manager === user.employeeId);
  const isManager = directReports.length > 0;

  // Team = direct reports if manager, otherwise colleagues sharing same manager
  let myTeam = [];
  if (isManager) {
    myTeam = directReports;
  } else if (myEmployee?.manager) {
    // Colleagues: same manager, excluding self
    myTeam = allEmployees.filter(
      (e) => e.manager === myEmployee.manager && e.id !== user.employeeId
    );
  }

  return {
    isEmployee: true,
    isManager,
    myEmployee,
    myTeam,
    directReports,
    canSeeAll: false,
  };
}

/** Returns true if the given employeeId is visible to the current user */
export function canViewEmployee(access, employeeId) {
  if (access.canSeeAll) return true;
  if (access.myEmployee?.id === employeeId) return true;
  if (access.myTeam.some((e) => e.id === employeeId)) return true;
  return false;
}
