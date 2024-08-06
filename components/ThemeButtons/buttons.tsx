'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

interface LightDarkButtonsProps {}

const LightDarkButtons: React.FC<LightDarkButtonsProps> = () => {
  const iconContainerStyle = {
    borderRadius: '50%',
    backgroundColor: '#313347',
    padding: 0.5,
    color: '#fff'
  };
  const { theme, setTheme } = useTheme();
  console.log('theme', theme);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      <IconButton sx={iconContainerStyle} onClick={() => setTheme('dark')}>
        <DarkModeIcon sx={{ color: '#fff' }} />
      </IconButton>
      <IconButton sx={iconContainerStyle} onClick={() => setTheme('light')}>
        <LightModeIcon sx={{ color: '#fff' }} />
      </IconButton>
    </Box>
  );
};

export default LightDarkButtons;
