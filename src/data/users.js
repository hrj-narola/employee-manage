export const USERS = {
  // Super Admin
  'superadmin@nexahr.com': {
    id: 'u0',
    email: 'superadmin@nexahr.com',
    password: 'super123',
    name: 'Alex Rivera',
    role: 'super_admin',
    tenantId: null,
    avatar: 'AR',
  },

  // Acme Corp Users
  'admin@acmecorp.com': {
    id: 'u1',
    email: 'admin@acmecorp.com',
    password: 'admin123',
    name: 'Sarah Chen',
    role: 'tenant_admin',
    tenantId: 'acme',
    avatar: 'SC',
    employeeId: 'emp_acme_001',
  },
  'hr@acmecorp.com': {
    id: 'u2',
    email: 'hr@acmecorp.com',
    password: 'hr123',
    name: 'Marcus Johnson',
    role: 'hr_manager',
    tenantId: 'acme',
    avatar: 'MJ',
    employeeId: 'emp_acme_002',
  },
  'john.doe@acmecorp.com': {
    id: 'u3',
    email: 'john.doe@acmecorp.com',
    password: 'emp123',
    name: 'John Doe',
    role: 'employee',
    tenantId: 'acme',
    avatar: 'JD',
    employeeId: 'emp_acme_003',
  },

  // TechFlow Inc Users
  'admin@techflow.io': {
    id: 'u4',
    email: 'admin@techflow.io',
    password: 'admin123',
    name: 'Priya Sharma',
    role: 'tenant_admin',
    tenantId: 'techflow',
    avatar: 'PS',
    employeeId: 'emp_tf_001',
  },
  'hr@techflow.io': {
    id: 'u5',
    email: 'hr@techflow.io',
    password: 'hr123',
    name: 'David Kim',
    role: 'hr_manager',
    tenantId: 'techflow',
    avatar: 'DK',
    employeeId: 'emp_tf_002',
  },

  // InnovateCo Users
  'admin@innovateco.ai': {
    id: 'u6',
    email: 'admin@innovateco.ai',
    password: 'admin123',
    name: 'Zara Ahmed',
    role: 'tenant_admin',
    tenantId: 'innovateco',
    avatar: 'ZA',
    employeeId: 'emp_ic_001',
  },
};

export const getUserByEmail = (email) => USERS[email] || null;
export const authenticateUser = (email, password) => {
  const user = USERS[email];
  if (user && user.password === password) return user;
  return null;
};
