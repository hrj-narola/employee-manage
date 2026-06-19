import { useParams } from 'react-router-dom';
import { Settings, Building2, Bell, Shield, Users } from 'lucide-react';
import { getTenant } from '../../data/tenants';

export default function SettingsPage() {
  const { tenantId } = useParams();
  const tenant = getTenant(tenantId);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your workspace preferences and configurations</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', maxWidth: 800 }}>
        {/* Company Info */}
        <div className="card animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-lg)' }}>
            <Building2 size={18} color="var(--accent-light)" />
            <div className="section-title">Company Information</div>
          </div>
          <div className="grid-2" style={{ gap: 'var(--space-md)' }}>
            {[
              { label: 'Company Name', val: tenant?.name },
              { label: 'Industry', val: tenant?.industry },
              { label: 'Plan', val: tenant?.plan },
              { label: 'Headquarters', val: tenant?.headquarters },
            ].map((f) => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {f.label}
                </label>
                <div style={{
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                }}>
                  {f.val || '—'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="ai-card animate-fade">
          <div className="ai-label">AI Features</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {[
              { label: 'Performance Analysis', desc: 'AI-driven employee performance scoring and insights', enabled: true },
              { label: 'Team Builder', desc: 'Intelligent team composition recommendations for projects', enabled: true },
              { label: 'Hiring Recommendations', desc: 'AI-powered hiring suggestions based on skill gaps', enabled: true },
              { label: 'Increment Analysis', desc: 'Data-backed salary increment recommendations', enabled: true },
            ].map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.desc}</div>
                </div>
                <div style={{
                  width: 44, height: 24,
                  background: f.enabled ? 'var(--gradient-ai)' : 'var(--bg-elevated)',
                  borderRadius: 12,
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 3, left: f.enabled ? 22 : 3,
                    width: 16, height: 16,
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card animate-fade">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-md)' }}>
            <Bell size={18} color="var(--accent-light)" />
            <div className="section-title">Notifications</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Notification preferences and integrations are configurable in the production version.
            <br />Currently using default settings: AI insights delivered weekly, attendance alerts daily.
          </p>
        </div>
      </div>
    </div>
  );
}
