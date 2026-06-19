import { Bell, Search, RefreshCw, Palette } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const { themeId, setTheme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  // Gradient previews for the dots
  const themeGradients = {
    violet: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    sky: 'linear-gradient(135deg, #0284c7, #38bdf8)',
    rose: 'linear-gradient(135deg, #e11d48, #fb7185)',
    mint: 'linear-gradient(135deg, #059669, #34d399)',
    amber: 'linear-gradient(135deg, #d97706, #fbbf24)',
  };

  return (
    <header className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        {/* Search */}
        <div className="search-bar">
          <Search size={15} className="search-icon" />
          <input
            id="global-search"
            className="form-input"
            placeholder="Search..."
            style={{ width: 200, paddingLeft: 36 }}
          />
        </div>

        {/* Theme Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            id="theme-switcher-btn"
            className="topbar-btn"
            onClick={() => setShowPicker((p) => !p)}
            title="Change theme"
            style={{ gap: 6 }}
          >
            <Palette size={15} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Theme</span>
          </button>

          {showPicker && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 198 }}
                onClick={() => setShowPicker(false)}
              />
              {/* Dropdown */}
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  zIndex: 199,
                  boxShadow: 'var(--shadow-lg)',
                  minWidth: 220,
                  animation: 'scaleIn 0.15s ease forwards',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
                  Choose Theme
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {Object.values(THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      id={`theme-${theme.id}`}
                      onClick={() => { setTheme(theme.id); setShowPicker(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: themeId === theme.id ? 'var(--bg-elevated)' : 'transparent',
                        border: themeId === theme.id ? '1.5px solid var(--border-default)' : '1.5px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseOver={(e) => { if (themeId !== theme.id) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                      onMouseOut={(e) => { if (themeId !== theme.id) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Preview swatch */}
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: themeGradients[theme.id],
                        flexShrink: 0,
                        boxShadow: themeId === theme.id ? '0 0 0 2px var(--accent)' : 'none',
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {theme.label}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {theme.id === 'violet' ? 'Default' : theme.id === 'sky' ? 'Oceanic' : theme.id === 'rose' ? 'Warm Pink' : theme.id === 'mint' ? 'Fresh Green' : 'Golden'}
                        </div>
                      </div>
                      {themeId === theme.id && (
                        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: themeGradients[theme.id] }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Refresh */}
        <button id="refresh-btn" className="topbar-btn">
          <RefreshCw size={15} />
        </button>

        {/* Notifications */}
        <button id="notifications-btn" className="topbar-btn" style={{ position: 'relative' }}>
          <Bell size={15} />
          <span className="notif-dot" />
        </button>

        {/* User Avatar */}
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: 'white',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {user?.avatar}
        </div>
      </div>
    </header>
  );
}
