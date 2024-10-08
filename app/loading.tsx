import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import model from '@/components/layout/model';

const LoadingPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        padding: { xs: 2, md: 4 },
        marginTop: 4,
        marginX: { xs: 2, lg: 8 }
      }}
    >
      <Image src={model.logo} width={250} height={40} alt=" logo" priority />

      <Box sx={{ width: 250 }}>
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default LoadingPage;
