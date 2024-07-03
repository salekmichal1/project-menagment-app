import React, { createContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';

export const ThemeContext = createContext({
  theme: 'light-theme',
  toggleTheme: () => {},
  toggleDarkMode: false,
});

const getCustomTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            // Define dark mode specific palette
            background: {
              default: '#121212',
              paper: '#424242',
            },
            text: {
              primary: '#ffffff',
            },
          }
        : {
            // Define light mode specific palette
            background: {
              default: '#ffffff',
              paper: '#f5f5f5',
            },
            text: {
              primary: '#000000',
            },
          }),
    },
    // You can extend the theme with more customizations
  });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>('light-theme');
  const [toggleDarkMode, setToggleDarkMode] = useState<boolean>(false);
  const muiTheme = getCustomTheme(theme === 'light-theme' ? 'light' : 'dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    setTheme(storedTheme);
    document.body.className = storedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-theme' ? 'dark-theme' : 'light-theme';
    setToggleDarkMode(!toggleDarkMode);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
    console.log('xd');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, toggleDarkMode }}>
      <MUIThemeProvider theme={muiTheme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
