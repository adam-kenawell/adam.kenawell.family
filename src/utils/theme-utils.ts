// Shared theme logic used by Layout.astro (inline) and ThemeControls.astro

// Theme mode CSS variable mappings
const THEME_VARS: Record<string, Record<string, string>> = {
  dark: {
    '--bg': '#1a1a1a', '--bg-rgb': '26,26,26', '--bg-card': 'rgba(26,26,26,0.9)',
    '--text': 'rgba(255,255,255,0.85)', '--text-muted': 'rgba(255,255,255,0.5)',
    '--text-faint': 'rgba(255,255,255,0.35)', '--header-bg': 'rgba(26,26,26,0.9)',
  },
  light: {
    '--bg': '#f5f5f5', '--bg-rgb': '245,245,245', '--bg-card': 'rgba(255,255,255,0.9)',
    '--text': 'rgba(30,30,30,0.9)', '--text-muted': 'rgba(30,30,30,0.55)',
    '--text-faint': 'rgba(30,30,30,0.35)', '--header-bg': 'rgba(245,245,245,0.9)',
  },
};

export function applyTheme(mode: string, accentRgb: string) {
  const r = document.documentElement;
  r.setAttribute('data-theme', mode);
  r.style.setProperty('--accent-rgb', accentRgb);
  r.style.setProperty('--accent', `rgb(${accentRgb})`);
  const vars = THEME_VARS[mode] || THEME_VARS.dark;
  for (const [k, v] of Object.entries(vars)) r.style.setProperty(k, v);
  localStorage.setItem('theme-mode', mode);
  localStorage.setItem('theme-accent', accentRgb);
}

export function applyStoredTheme() {
  applyTheme(
    localStorage.getItem('theme-mode') || 'dark',
    localStorage.getItem('theme-accent') || '245,208,0',
  );
}
