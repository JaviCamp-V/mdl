// Server Component
import React from 'react';
import { getDiscoverType } from '@/features/media/service/tmdbAdvancedService';
import { getTopAiring } from '@/features/media/utils/tmdbQueries';
import Box from '@mui/material/Box';
import MediaType from '@/types/enums/IMediaType';
import countries from '@/libs/countries';
import TopAiringResults from './Results';

interface TopAiringProps {
  containerStyle?: React.CSSProperties;
}

const TopAiringDramas: React.FC<TopAiringProps> = async ({ containerStyle }) => {
  const results = await Promise.all(
    countries.map(async (country) => {
      const params = getTopAiring(country.code);
      const response = await getDiscoverType(MediaType.tv, params, false);
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
