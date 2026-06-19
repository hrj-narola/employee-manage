import { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  violet: {
    id: 'violet',
    label: 'Violet',
    preview: ['#ede9fe', '#7c3aed', '#ddd6fe'],
    vars: {
      '--bg-base': '#f5f3ff',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#faf8ff',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f5f3ff',
      '--bg-input': '#f5f3ff',
      '--border-subtle': 'rgba(124,58,237,0.08)',
      '--border-default': 'rgba(124,58,237,0.18)',
      '--border-strong': 'rgba(124,58,237,0.32)',
      '--text-primary': '#1e1333',
      '--text-secondary': '#4c3d6e',
      '--text-muted': '#8b7aaa',
      '--text-disabled': '#c4b8dc',
      '--accent': '#7c3aed',
      '--accent-light': '#a78bfa',
      '--accent-dark': '#5b21b6',
      '--accent2': '#8b5cf6',
      '--accent2-light': '#c4b5fd',
      '--ai-color': '#7c3aed',
      '--ai-color2': '#6d28d9',
      '--gradient-brand': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
      '--gradient-ai': 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
      '--gradient-card': 'linear-gradient(135deg, rgba(124,58,237,0.03) 0%, rgba(139,92,246,0.01) 100%)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-border': 'rgba(124,58,237,0.08)',
      '--topbar-bg': 'rgba(255,255,255,0.88)',
      '--shadow-sm': '0 1px 4px rgba(124,58,237,0.06)',
      '--shadow-md': '0 4px 20px rgba(124,58,237,0.1)',
      '--shadow-lg': '0 8px 40px rgba(124,58,237,0.12)',
      '--shadow-glow': '0 0 24px rgba(124,58,237,0.15)',
    },
  },

  sky: {
    id: 'sky',
    label: 'Sky',
    preview: ['#e0f2fe', '#0284c7', '#bae6fd'],
    vars: {
      '--bg-base': '#f0f9ff',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#f0f9ff',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#e0f2fe',
      '--bg-input': '#f0f9ff',
      '--border-subtle': 'rgba(2,132,199,0.08)',
      '--border-default': 'rgba(2,132,199,0.18)',
      '--border-strong': 'rgba(2,132,199,0.32)',
      '--text-primary': '#0c2a3d',
      '--text-secondary': '#1e5875',
      '--text-muted': '#5899b8',
      '--text-disabled': '#a8d4e6',
      '--accent': '#0284c7',
      '--accent-light': '#38bdf8',
      '--accent-dark': '#0369a1',
      '--accent2': '#06b6d4',
      '--accent2-light': '#67e8f9',
      '--ai-color': '#0284c7',
      '--ai-color2': '#0369a1',
      '--gradient-brand': 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
      '--gradient-ai': 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      '--gradient-card': 'linear-gradient(135deg, rgba(2,132,199,0.03) 0%, rgba(6,182,212,0.01) 100%)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-border': 'rgba(2,132,199,0.08)',
      '--topbar-bg': 'rgba(255,255,255,0.88)',
      '--shadow-sm': '0 1px 4px rgba(2,132,199,0.06)',
      '--shadow-md': '0 4px 20px rgba(2,132,199,0.1)',
      '--shadow-lg': '0 8px 40px rgba(2,132,199,0.12)',
      '--shadow-glow': '0 0 24px rgba(2,132,199,0.15)',
    },
  },

  rose: {
    id: 'rose',
    label: 'Rose',
    preview: ['#fff1f2', '#e11d48', '#fecdd3'],
    vars: {
      '--bg-base': '#fff1f2',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#fff5f6',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#fff1f2',
      '--bg-input': '#fff5f6',
      '--border-subtle': 'rgba(225,29,72,0.08)',
      '--border-default': 'rgba(225,29,72,0.16)',
      '--border-strong': 'rgba(225,29,72,0.28)',
      '--text-primary': '#3b0a14',
      '--text-secondary': '#7f1d2e',
      '--text-muted': '#b5526a',
      '--text-disabled': '#e2a3b0',
      '--accent': '#e11d48',
      '--accent-light': '#fb7185',
      '--accent-dark': '#be123c',
      '--accent2': '#f43f5e',
      '--accent2-light': '#fda4af',
      '--ai-color': '#e11d48',
      '--ai-color2': '#be123c',
      '--gradient-brand': 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      '--gradient-ai': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
      '--gradient-card': 'linear-gradient(135deg, rgba(225,29,72,0.03) 0%, rgba(244,63,94,0.01) 100%)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-border': 'rgba(225,29,72,0.08)',
      '--topbar-bg': 'rgba(255,255,255,0.88)',
      '--shadow-sm': '0 1px 4px rgba(225,29,72,0.06)',
      '--shadow-md': '0 4px 20px rgba(225,29,72,0.1)',
      '--shadow-lg': '0 8px 40px rgba(225,29,72,0.12)',
      '--shadow-glow': '0 0 24px rgba(225,29,72,0.12)',
    },
  },

  mint: {
    id: 'mint',
    label: 'Mint',
    preview: ['#ecfdf5', '#059669', '#a7f3d0'],
    vars: {
      '--bg-base': '#ecfdf5',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#f0fdf8',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#ecfdf5',
      '--bg-input': '#f0fdf8',
      '--border-subtle': 'rgba(5,150,105,0.08)',
      '--border-default': 'rgba(5,150,105,0.18)',
      '--border-strong': 'rgba(5,150,105,0.3)',
      '--text-primary': '#052e1c',
      '--text-secondary': '#065f46',
      '--text-muted': '#4b9e7e',
      '--text-disabled': '#a3d9c2',
      '--accent': '#059669',
      '--accent-light': '#34d399',
      '--accent-dark': '#047857',
      '--accent2': '#10b981',
      '--accent2-light': '#6ee7b7',
      '--ai-color': '#059669',
      '--ai-color2': '#047857',
      '--gradient-brand': 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      '--gradient-ai': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      '--gradient-card': 'linear-gradient(135deg, rgba(5,150,105,0.03) 0%, rgba(16,185,129,0.01) 100%)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-border': 'rgba(5,150,105,0.08)',
      '--topbar-bg': 'rgba(255,255,255,0.88)',
      '--shadow-sm': '0 1px 4px rgba(5,150,105,0.06)',
      '--shadow-md': '0 4px 20px rgba(5,150,105,0.1)',
      '--shadow-lg': '0 8px 40px rgba(5,150,105,0.12)',
      '--shadow-glow': '0 0 24px rgba(5,150,105,0.14)',
    },
  },

  amber: {
    id: 'amber',
    label: 'Amber',
    preview: ['#fffbeb', '#d97706', '#fde68a'],
    vars: {
      '--bg-base': '#fffbeb',
      '--bg-surface': '#ffffff',
      '--bg-elevated': '#fefce8',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#fffbeb',
      '--bg-input': '#fefce8',
      '--border-subtle': 'rgba(217,119,6,0.08)',
      '--border-default': 'rgba(217,119,6,0.18)',
      '--border-strong': 'rgba(217,119,6,0.3)',
      '--text-primary': '#292100',
      '--text-secondary': '#78400a',
      '--text-muted': '#b07c30',
      '--text-disabled': '#e5c883',
      '--accent': '#d97706',
      '--accent-light': '#fbbf24',
      '--accent-dark': '#b45309',
      '--accent2': '#f59e0b',
      '--accent2-light': '#fcd34d',
      '--ai-color': '#d97706',
      '--ai-color2': '#b45309',
      '--gradient-brand': 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      '--gradient-ai': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      '--gradient-card': 'linear-gradient(135deg, rgba(217,119,6,0.03) 0%, rgba(245,158,11,0.01) 100%)',
      '--sidebar-bg': '#ffffff',
      '--sidebar-border': 'rgba(217,119,6,0.08)',
      '--topbar-bg': 'rgba(255,255,255,0.88)',
      '--shadow-sm': '0 1px 4px rgba(217,119,6,0.06)',
      '--shadow-md': '0 4px 20px rgba(217,119,6,0.1)',
      '--shadow-lg': '0 8px 40px rgba(217,119,6,0.12)',
      '--shadow-glow': '0 0 24px rgba(217,119,6,0.12)',
    },
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('nexahr_theme') || 'violet';
  });

  const theme = THEMES[themeId] || THEMES.violet;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
    localStorage.setItem('nexahr_theme', themeId);
  }, [themeId, theme]);

  const setTheme = (id) => {
    if (THEMES[id]) setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
