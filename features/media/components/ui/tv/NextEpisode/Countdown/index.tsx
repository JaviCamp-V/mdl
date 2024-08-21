'use client';

import React from 'react';
import useTimer from '@/features/media/hooks/useTimer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDigitsWithPadding } from '@/utils/formatters';

interface CountdownProps {
  date: Date;
}

const Countdown: React.FC<CountdownProps> = ({ date }) => {
  const { hasEnded, isValid, ...timer } = useTimer(date);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      {Object.entries(timer).map(([key, value], index, arr) => (
        <Box
          key={key}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            justifyContent: 'center',
            alignItems: 'center',
            paddingY: 0.2,
            paddingX: 1,
            ...(index !== arr.length - 1 && { borderRight: '1px solid #fff' })
          }}
        >
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#fff' }} suppressHydrationWarning>
            {formatDigitsWithPadding(value, 2)}
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 400, color: '#a1aac1' }}>{key}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Countdown;
