'use server'; // only use within server components
import { color } from '@/libs/common';
import { getDiscoverType } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { upcomingTvShows } from '@/utils/tmdbQueries';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import DramaList from '../../DramaList';
import routes from '@/libs/routes';

interface TopUpComingDramasProps {
  containerStyle?: React.CSSProperties;
}
const TopUpcomingDramas: React.FC<TopUpComingDramasProps> = async ({ containerStyle }) => {
  const response = await getDiscoverType(MediaType.tv, upcomingTvShows);

  return (
    <Box sx={{ ...containerStyle, paddingX: 0, paddingY: 2, minHeight: 0 }}>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1, paddingX: 2 }}
      >
        <Typography color={color} fontSize={18} fontWeight={500}>
          Top Upcoming 
        </Typography>
        <Link href={routes.discoverUpcoming} style={{ textDecoration: 'none' }}>
          <Typography color={color} fontSize={14}>
            more
          </Typography>
        </Link>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <DramaList dramas={response.results as any[]} />
      </Box>
    </Box>
  );
};

export default TopUpcomingDramas;
