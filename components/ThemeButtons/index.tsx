'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';


const ThemeButtons = () => {
  const { theme, setTheme } = useTheme();
  const options = [
    {
      value: 'dark',
      Icon: <DarkModeIcon sx={{ fontSize: 20 }} />,
      backgroundColor: theme === 'dark' ? '#313347' : '#fff',
      color: theme === 'dark' ? '#fff' : '#313347',
      onHover: '#6887ff'
    },
    {
      value: 'light',
      Icon: <LightModeIcon sx={{ fontSize: 20 }} />,
      backgroundColor: theme === 'light' ? '#313347' : '#fff',
      color: theme === 'light' ? '#fff' : '#313347',
      onHover: '#ffeb3b'
    }
  ];
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      {options.map((option) => (
        <IconButton
          key={option.value}
          sx={{
            borderRadius: '50%',
            padding: 0.5,
            backgroundColor: theme === option.value ? '#fff' : '#313347',
            color: theme === option.value ? '#313347' : '#fff',
            '&:hover': {
              backgroundColor: option.onHover
            }
          }}
          onClick={() => setTheme(option.value)}
        >
          {option.Icon}
        </IconButton>
      ))}
    </Box>
  );
};

export default ThemeButtons;