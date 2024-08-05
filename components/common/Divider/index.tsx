import React from 'react';
import { Box, SxProps } from '@mui/material';

const Divider: React.FC<SxProps> = (sx) => (
  <Box
    sx={{
      borderBottom: '1px solid hsla(210, 8%, 51%, .13)',
      marginY: 2,
      ...sx
    }}
  />
);

export default Divider;
