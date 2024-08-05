'use server';
import React from 'react';

import Box from '@mui/material/Box';
import TopAiringResults from './Results';

import { getDiscoverType } from '@/server/tmdb2Actions';

import MediaType from '@/types/tmdb/IMediaType';
import { TVSearchResult } from '@/types/tmdb/ISearchResposne';
import countriesConfig from '@/libs/countriesConfig';
import { getTopAiring } from '@/utils/tmdbQueries';

interface TopAiringProps {
  containerStyle?: React.CSSProperties;
}

const TopAiringDramas: React.FC<TopAiringProps> = async ({ containerStyle }) => {
  const results = await Promise.all(
    countriesConfig.map(async (country) => {
      const params = getTopAiring(country.code);
      const response = await getDiscoverType(MediaType.tv, params);
      return { code: country.code, dramas: response.results as TVSearchResult[], name: country.fullName };
    })
  );
  return (
    <Box sx={{ ...containerStyle, minHeight: 0, paddingX: 0, paddingTop: 2, marginTop: 0 }}>
      <TopAiringResults data={results} />
    </Box>
  );
};

export default TopAiringDramas;
