import React from 'react';
import { capitalCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@/components/common/Divider';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import MediaType from '@/types/tmdb/IMediaType';
import { endingThisWeek, startingThisWeek, trending } from '@/utils/tmdbQueries';
import { color } from '@/libs/common';
import DiscoverCarousel from './Results';

interface DramaUpdatesProps {
  containerStyle?: React.CSSProperties;
}
const DramaUpdates: React.FC<DramaUpdatesProps> = ({ containerStyle }) => {
  const updatesQueries = { trending, startingThisWeek, endingThisWeek };
  return (
    <Box sx={{ ...containerStyle, paddingTop: 2, paddingBottom: 4 }}>
      {Object.entries(updatesQueries).map(([title, params], index, arr) => (
        <Box paddingY={0} key={title}>
          <Typography
            sx={{
              paddingX: 2,
              color: color,
              marginBottom: 2,
              fontSize: 24,
              fontWeight: 500
            }}
          >
            {capitalCase(title)}
          </Typography>
          <React.Suspense fallback={<LoadingSkeleton width={'100%'} height={'30vh'} />}>
            <DiscoverCarousel type={MediaType.tv} params={params} />
          </React.Suspense>
          {index !== arr.length - 1 && <Divider />}
        </Box>
      ))}
    </Box>
  );
};

export default DramaUpdates;