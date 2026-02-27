// Theme definitions for XO Arena
// Each theme changes the visual appearance of the game

export const themes = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'The classic XO Arena experience',
    colors: {
      bg: '#0f172a',
      bgPanel: 'rgba(15, 23, 42, 0.8)',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      x: '#06b6d4',
      o: '#8b5cf6',
      glassBorder: 'rgba(255, 255, 255, 0.15)',
      accent: '#06b6d4'
    },
    free: true
  },
  neon: {
    id: 'neon',
    name: 'Neon Arcade',
    description: 'Electrifying magenta & green with intense glow',
    colors: {
      bg: '#0a0a0a',
      bgPanel: 'rgba(10, 10, 10, 0.9)',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      x: '#ff00ff',
      o: '#00ff00',
      glassBorder: 'rgba(255, 0, 255, 0.3)',
      accent: '#ff00ff'
    },
    storeId: 'theme_neon',
    price: 0.99
  },
  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Serene underwater blues with bioluminescent glow',
    colors: {
      bg: '#0c1929',
      bgPanel: 'rgba(12, 25, 41, 0.9)',
      textPrimary: '#e0f2fe',
      textSecondary: '#7dd3fc',
      x: '#00d4ff',
      o: '#0066ff',
      glassBorder: 'rgba(0, 212, 255, 0.2)',
      accent: '#00d4ff'
    },
    storeId: 'theme_ocean',
    price: 0.99
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm amber tones inspired by tropical sunsets',
    colors: {
      bg: '#1a0a0a',
      bgPanel: 'rgba(26, 10, 10, 0.9)',
      textPrimary: '#fef3c7',
      textSecondary: '#fcd34d',
      x: '#ff6b35',
      o: '#f7c59f',
      glassBorder: 'rgba(255, 107, 53, 0.2)',
      accent: '#ff6b35'
    },
    storeId: 'theme_sunset',
    price: 0.99
  },
  minimal: {
    id: 'minimal',
    name: 'Pure Minimal',
    description: 'Elegant monochrome for focused gameplay',
    colors: {
      bg: '#ffffff',
      bgPanel: 'rgba(245, 245, 245, 0.9)',
      textPrimary: '#000000',
      textSecondary: '#666666',
      x: '#000000',
      o: '#666666',
      glassBorder: 'rgba(0, 0, 0, 0.1)',
      accent: '#000000'
    },
    storeId: 'theme_minimal',
    price: 0.99
  }
};

export const themeBundle = {
  id: 'theme_bundle',
  name: 'All Themes Bundle',
  description: 'Unlock all 4 premium themes',
  storeId: 'theme_bundle',
  price: 2.99,
  includes: ['neon', 'ocean', 'sunset', 'minimal']
};

// Helper to apply theme to CSS variables
export function applyTheme(themeId) {
  const theme = themes[themeId] || themes.default;
  const root = document.documentElement;

  root.style.setProperty('--bg-app', theme.colors.bg);
  root.style.setProperty('--bg-panel', theme.colors.bgPanel);
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-cyan', theme.colors.x);
  root.style.setProperty('--color-violet', theme.colors.o);
  root.style.setProperty('--glass-border', theme.colors.glassBorder);
  root.style.setProperty('--color-accent', theme.colors.accent);
}

export default themes;
