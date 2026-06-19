import { useNavigate } from 'react-router-dom';
import { getAllTenants } from '../../data/tenants';
import { getEmployeesByTenant } from '../../data/employees';
import { getProjectsByTenant } from '../../data/projects';
import { Building2, Users, FolderKanban, ArrowUpRight, CheckCircle } from 'lucide-react';

const TENANT_COLORS = {
  acme: '#6366f1',
  techflow: '#06b6d4',
  innovateco: '#10b981',
};

export default function TenantsPage() {
  const navigate = useNavigate();
  const tenants = getAllTenants();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">All Tenants</h1>
        <p className="page-subtitle">Platform-wide tenant management and overview</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {tenants.map((t) => {
          const employees = getEmployeesByTenant(t.id);
          const projects = getProjectsByTenant(t.id);
          const activeProjects = projects.filter((p) => p.status === 'active');

          return (
            <div key={t.id} className="card animate-fade" style={{ borderLeft: `4px solid ${TENANT_COLORS[t.id]}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '2 1 280px' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: TENANT_COLORS[t.id], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {t.logo}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>{t.industry} · {t.headquarters}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="badge badge-default">{t.plan} Plan</span>
                      <span className="badge badge-success">Active</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xl)', flex: '1 1 320px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Employees', val: employees.length, icon: <Users size={14} /> },
                    { label: 'Active Projects', val: activeProjects.length, icon: <FolderKanban size={14} /> },
                    { label: 'Founded', val: t.founded, icon: <Building2 size={14} /> },
                    { label: 'Monthly Rev', val: t.metrics.monthlyRevenue, icon: <CheckCircle size={14} /> },
                  ].map((s) => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 11, marginBottom: 2 }}>
                        {s.icon} {s.label}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ flexShrink: 0 }}
                  onClick={() => navigate(`/${t.id}/dashboard`)}
                >
                  Open <ArrowUpRight size={14} />
                </button>
              </div>
              <p style={{ marginTop: 'var(--space-md)', fontSize: 13, color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-md)' }}>
                {t.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
