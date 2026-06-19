import { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('nexahr_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (_) {
        sessionStorage.removeItem('nexahr_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const u = authenticateUser(email, password);
    if (u) {
      const { password: _, ...safeUser } = u;
      setUser(safeUser);
      sessionStorage.setItem('nexahr_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('nexahr_user');
  };

  const hasPermission = (minRole) => {
    if (!user) return false;
    const hierarchy = ['employee', 'hr_manager', 'tenant_admin', 'super_admin'];
    return hierarchy.indexOf(user.role) >= hierarchy.indexOf(minRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
