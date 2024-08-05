'use server'; // only use within server components
import { color } from '@/libs/common';
import { getDiscoverType } from '@/server/tmdb2Actions';
import MediaType from '@/types/tmdb/IMediaType';
import { mostPopular } from '@/utils/tmdbQueries';
import { Link } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import DramaList from '../../DramaList';
import routes from '@/libs/routes';

interface MostPopularDramasProps {
  containerStyle?: React.CSSProperties;
}
const MostPopularDramas: React.FC<MostPopularDramasProps> = async ({ containerStyle }) => {
  const response = await getDiscoverType(MediaType.tv, mostPopular);

  return (
    <Box sx={{ ...containerStyle, paddingX:0, paddingY: 2, minHeight: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1, paddingX: 2 }}>
        <Typography color={color} fontSize={18} fontWeight={500}>
          Most Popular
        </Typography>
        <Link href={routes.discoverPopular} style={{ textDecoration: 'none' }}>
          <Typography color={color} fontSize={14}>
            more
          </Typography>
        </Link>
      </Box>
      <Box sx={{marginTop: 2}}>
        <DramaList dramas={response.results as any[]} length={5} />
      </Box>
    </Box>
  );
};

export default MostPopularDramas;
