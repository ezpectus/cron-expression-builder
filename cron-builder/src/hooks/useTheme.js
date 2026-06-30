import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cron_builder_theme';

class ThemeManager {
  constructor() {
    this.listeners = new Set();
    this.currentTheme = 'dark';
  }

  init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      this.currentTheme = stored;
    }
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    this.listeners.forEach((cb) => cb(theme));
  }

  toggle() {
    this.applyTheme(this.currentTheme === 'dark' ? 'light' : 'dark');
  }

  getTheme() {
    return this.currentTheme;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

let themeManagerInstance = null;

export function getThemeManager() {
  if (!themeManagerInstance) {
    themeManagerInstance = new ThemeManager();
  }
  return themeManagerInstance;
}

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const manager = getThemeManager();
    manager.init();
    setTheme(manager.getTheme());
    const unsubscribe = manager.subscribe((newTheme) => {
      setTheme(newTheme);
    });
    return unsubscribe;
  }, []);

  const toggleTheme = useCallback(() => {
    getThemeManager().toggle();
  }, []);

  const setThemeMode = useCallback((mode) => {
    getThemeManager().applyTheme(mode);
  }, []);

  return { theme, toggleTheme, setThemeMode };
}
