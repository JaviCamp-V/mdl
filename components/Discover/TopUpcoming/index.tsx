'use server';

import React from 'react';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getDiscoverType } from '@/server/tmdbActions';
import MediaType from '@/types/tmdb/IMediaType';
import { upcomingTvShows } from '@/utils/tmdbQueries';
import { color } from '@/libs/common';
import routes from '@/libs/routes';
import DramaList from '../../DramaList';

interface TopUpComingDramasProps {
  containerStyle?: React.CSSProperties;
}
const TopUpcomingDramas: React.FC<TopUpComingDramasProps> = async ({ containerStyle }) => {
  const response = await getDiscoverType(MediaType.tv, upcomingTvShows);

  return (
    <Box sx={{ ...containerStyle, paddingX: 0, paddingY: 2, minHeight: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 1,
          paddingX: 2
        }}
      >
        <Typography  fontSize={18} fontWeight={700}>
          Top Upcoming
        </Typography>
        <Link href={routes.discoverUpcoming} style={{ textDecoration: 'none' }}>
          <Typography  fontSize={14} color="text.primary">
            more
          </Typography>
        </Link>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <DramaList dramas={response.results} />
      </Box>
    </Box>
  );
};

export default TopUpcomingDramas;
