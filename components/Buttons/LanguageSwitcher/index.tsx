import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface GlobalLanguageSwitcherProps {}
const GlobalLanguageSwitcher: React.FC<GlobalLanguageSwitcherProps> = () => {
  return (
    <Box
      sx={{
        border: '1px solid #fff',
        borderRadius: 1,
        cursor: 'pointer',
        pointerEvents: 'auto',
        padding: 1.2,
        width: 12,
        height: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography fontSize={11} fontWeight={400} textTransform="lowercase" sx={{ color: 'white' }}>
        EN
      </Typography>
    </Box>
  );
};

export default GlobalLanguageSwitcher;
