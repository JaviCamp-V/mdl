'use server';

import React from 'react';
import Box from '@mui/material/Box';
import { getDiscoverType } from '@/server/tmdbActions';
import MediaType from '@/types/tmdb/IMediaType';
import { getTopAiring } from '@/utils/tmdbQueries';
import countries from '@/libs/countries';
import TopAiringResults from './Results';

interface TopAiringProps {
  containerStyle?: React.CSSProperties;
}

const TopAiringDramas: React.FC<TopAiringProps> = async ({ containerStyle }) => {
  const results = await Promise.all(
    countries.map(async (country) => {
      const params = getTopAiring(country.code);
      const response = await getDiscoverType(MediaType.tv, params);
      return {
        code: country.code,
        dramas: response.results,
        name: country.fullName
      };
    })
  );
  return (
    <Box
      sx={{
        ...containerStyle,
        minHeight: 0,
        paddingX: 0,
        paddingTop: 2,
        marginTop: 0
      }}
    >
      <TopAiringResults data={results} />
    </Box>
  );
};

export default TopAiringDramas;
