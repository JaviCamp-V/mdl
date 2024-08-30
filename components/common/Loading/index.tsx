import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import model from '@/components/layout/model';

const Loading = () => {
  return <Skeleton sx={{ height: '50vh', width: '100%', backgroundColor: 'background.paper' }} variant="rounded" />;
};

export default Loading;
