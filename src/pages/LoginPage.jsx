import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Eye, EyeOff, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'superadmin@nexahr.com', password: 'super123', label: 'Super Admin', color: '#8b5cf6', tenant: 'Platform' },
  { email: 'admin@acmecorp.com', password: 'admin123', label: 'Acme Admin', color: '#7c3aed', tenant: 'Acme Corp' },
  { email: 'hr@acmecorp.com', password: 'hr123', label: 'HR Manager', color: '#0284c7', tenant: 'Acme Corp' },
  { email: 'john.doe@acmecorp.com', password: 'emp123', label: 'Employee', color: '#059669', tenant: 'Acme Corp' },
  { email: 'admin@techflow.io', password: 'admin123', label: 'TechFlow Admin', color: '#0284c7', tenant: 'TechFlow' },
  { email: 'admin@innovateco.ai', password: 'admin123', label: 'InnovateCo Admin', color: '#059669', tenant: 'InnovateCo' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      const u = result.user;
      if (u.role === 'super_admin') navigate('/super-admin/dashboard');
      else navigate(`/${u.tenantId}/dashboard`);
    } else {
      setError('Invalid email or password. Try a demo account below.');
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      overflow: 'hidden',
    }}>
      {/* Left Panel — Hero */}
      <div style={{
        flex: '0 0 50%',
        background: 'linear-gradient(160deg, var(--accent) 0%, var(--accent2) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative Blobs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '320px', height: '320px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '-60px',
          width: '280px', height: '280px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '-40px',
          width: '200px', height: '200px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
          <div style={{
            width: 48, height: 48,
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>NH</div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 700,
            color: 'white',
          }}>NexaHR</span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '2.75rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            color: 'white',
          }}>
            AI-Powered<br />
            Employee<br />
            Intelligence
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.82)',
            lineHeight: 1.7,
            maxWidth: 380,
          }}>
            Make smarter workforce decisions with AI-driven performance analytics, intelligent team building, and automated hiring recommendations.
          </p>
        </div>

        {/* Feature Pillls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: <Brain size={16} />, text: 'AI Performance Analysis', sub: 'Data-driven employee insights' },
            { icon: <Zap size={16} />, text: 'Smart Team Builder', sub: 'Optimal team for any project' },
            { icon: <Shield size={16} />, text: 'Multi-Tenant Secure', sub: 'Enterprise-grade isolation' },
            { icon: <TrendingUp size={16} />, text: 'Increment Intelligence', sub: 'Fair, data-backed salary advice' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                width: 32, height: 32,
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{f.text}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        flex: '0 0 50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '64px',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
      }}>
        <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '32px' }}>
            Sign in to your NexaHR workspace
          </p>

          {/* Demo Accounts */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
              Quick Login — Click to fill
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  style={{
                    padding: '8px 10px',
                    background: email === acc.email ? 'var(--bg-elevated)' : 'var(--bg-base)',
                    border: `1.5px solid ${email === acc.email ? acc.color : 'var(--border-subtle)'}`,
                    borderRadius: 8,
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: acc.color }}>{acc.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{acc.tenant}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '24px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or enter manually</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                borderRadius: 10,
                fontSize: 13,
                color: 'var(--danger)',
              }}>
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="loading-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p style={{ marginTop: '28px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
            NexaHR MVP · AI Employee Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
}
