import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const GraphlynkThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function GraphlynkThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('graphlynk-theme');
    return (saved as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('graphlynk-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <GraphlynkThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </GraphlynkThemeContext.Provider>
  );
}

export function useGraphlynkTheme() {
  const context = useContext(GraphlynkThemeContext);
  if (context === undefined) {
    throw new Error('useGraphlynkTheme must be used within a GraphlynkThemeProvider');
  }
  return context;
}
