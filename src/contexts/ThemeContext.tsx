'use client';

import { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { useUser } from '@stackframe/stack';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProviderInner({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);
  const user = useUser();

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    setMounted(true);
  }, []);

  // Load theme from user profile
  useEffect(() => {
    async function loadUserTheme() {
      if (!user) return;
      
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          const userTheme = data.profile?.notificationPreferences?.theme;
          if (userTheme && (userTheme === 'light' || userTheme === 'dark')) {
            setThemeState(userTheme);
            document.documentElement.setAttribute('data-theme', userTheme);
            localStorage.setItem('theme', userTheme);
          }
        }
      } catch (error) {
        console.error('Error loading user theme:', error);
      }
    }

    if (mounted && user) {
      loadUserTheme();
    }
  }, [user, mounted]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Save to database if user is logged in
    if (user) {
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationPreferences: {
              theme: newTheme,
            },
          }),
        });
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Render always; initial theme is enforced pre-hydration via layout script.

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ThemeProviderInner>{children}</ThemeProviderInner>
    </Suspense>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

