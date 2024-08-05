import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Credits } from '@/types/tmdb/IPeople';
import { color } from '@/libs/common';

const CrewSummary: React.FC<Credits> = ({ crew }) => {
  const directors = crew.filter((crew) => crew.job === 'Director');
  const writers = crew.filter((crew) => crew.job === 'Screenplay' || crew.job === 'Writer');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Box sx={{ display: 'inline', whiteSpace: 'pre-line', width: '80%' }}>
        <Typography sx={{ display: 'inline' }} color={color} fontWeight={500} paddingRight={1}>
          Director:
        </Typography>
        <Typography sx={{ display: 'inline' }} color={color}>
          {directors.map((director) => director.name).join(', ') || 'N/A'}
        </Typography>
      </Box>

      <Box sx={{ display: 'inline', whiteSpace: 'pre-line', width: '80%' }}>
        <Typography sx={{ display: 'inline' }} color={color} fontWeight={500} paddingRight={1}>
          Screenwriter:
        </Typography>
        <Typography sx={{ display: 'inline' }} color={color}>
          {writers.map((writer) => writer.name).join(', ') || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CrewSummary;
