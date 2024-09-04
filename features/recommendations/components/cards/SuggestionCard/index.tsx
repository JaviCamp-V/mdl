'use client';

import React from 'react';
import { Suggestion } from '@/features/recommendations/types/interface/Suggestion';
import Box from '@mui/material/Box';
import MediaCardToolTip from '@/components/MediaCardToolTip';
import DramaPoster from '@/components/Poster';
import { formatStringDate } from '@/utils/formatters';

interface SuggestionCardProps {
  suggestion: Suggestion;
}
const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const {
    poster_path,
    title,
    vote_average,
    release_date,
    mediaType,
    mediaId,
    original_title,
    overview,
    genres,
    country
  } = suggestion;
  const year = release_date ? formatStringDate(release_date).getFullYear() : 0;
  return (
    <Box>
      <MediaCardToolTip
        id={mediaId}
        title={title}
        year={year}
        mediaType={mediaType}
        originalTitle={original_title}
        country={country}
        voteAverage={vote_average}
        overview={overview}
        posterPath={poster_path}
        genres={genres}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '100%' },
             height: { xs: '15vh', sm: '25vh' }
          }}
        >
          <DramaPoster src={poster_path} mediaType={mediaType} id={mediaId} size="w342" />
        </Box>
      </MediaCardToolTip>
    </Box>
  );
};

export default SuggestionCard;
