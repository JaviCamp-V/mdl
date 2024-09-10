'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import dark from '@/theme/dark';
import light from '@/theme/light';


interface MuiThemeProviderProps {
  children: React.ReactNode;
}
const MuiThemeProvider: React.FC<MuiThemeProviderProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const defaultTheme = resolvedTheme === 'light' ? light : dark;
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;