'use client';

import React from 'react';
import ContentSummary from '@/features/media/types/interfaces/ContentSummary';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import MediaCardToolTip from '@/components/MediaCardToolTip';
import DramaPoster from '@/components/Poster';
import { formatStringDate } from '@/utils/formatters';
import countries from '@/libs/countries';

interface SuggestionCardProps {
  content: ContentSummary;
  posterStyle?: SxProps;
}
const SuggestionCard: React.FC<SuggestionCardProps> = ({ content, posterStyle }) => {
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
    origin_country
  } = content;
  console.log(content);
  const year = release_date ? formatStringDate(release_date).getFullYear() : 0;
  const country = origin_country.map((c) => countries.find((country) => (country.code = c))?.fullName ?? c).join(', ');
  return (
    <Box sx={{}}>
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
            height: { xs: '15vh', sm: '25vh' },
            ...posterStyle
          }}
        >
          <DramaPoster src={poster_path} mediaType={mediaType} id={mediaId} size="w342" />
        </Box>
      </MediaCardToolTip>
    </Box>
  );
};

export default SuggestionCard;