'use server';

import React from 'react';
import { sentenceCase } from 'change-case';
import { Box, Typography } from '@mui/material';
import { getTVContentRating } from '@/server/tmdbActions';
import { lookupShow } from '@/server/tvMazeActions';
import Genres from '@/components/MeidiaDetails/Details/sections/Genres';
import Tags from '@/components/MeidiaDetails/Details/sections/Tags';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import { formatRuntime, formatShortDate, formatStringDate } from '@/utils/formatters';
import { color } from '@/libs/common';

type MovieDetailsSummaryProps = {
  details: MovieDetails;
  type: MediaType.movie;
  tab: string;
};

type TVDetailsSummaryProps = {
  details: TVDetails;
  type: MediaType.tv;
  tab?: string;
};

export type DetailsSummaryProps = MovieDetailsSummaryProps | TVDetailsSummaryProps;

const DetailsSummary: React.FC<DetailsSummaryProps> = async ({ details, type, tab }) => {
  let daysAiring = '';
  let contentRating = 'Not Yet Rated';
  if (type === MediaType.tv) {
    const response = await lookupShow(details.external_ids.tvdb_id);
    daysAiring = response?.schedule?.days.join(', ') ?? 'N/A';
    const ratings = await getTVContentRating(details.id);
    contentRating =
      ratings
        ?.filter(({ iso_3166_1 }) => ['US', ...details.origin_country].includes(iso_3166_1))
        ?.map(({ rating }) => rating)
        ?.join(', ') || 'Not Yet Rated';
  }

  const data = {
    title: type === MediaType.movie ? details.title : details.name,
    country: details.production_countries.map(({ name }) => name).join(', ') || 'N/A',
    ...(type === MediaType.tv
      ? {
          episodes: details.number_of_episodes || 'N/A',
          airs: `${details.first_air_date ? formatShortDate(formatStringDate(details.first_air_date)) : 'TBD'} - ${
            details.last_air_date ? formatShortDate(formatStringDate(details.last_air_date)) : 'TBD'
          }`,
          airsOn: daysAiring || 'N/A',
          originalNetwork: details.networks.map(({ name }) => name).join(', ') || 'N/A',
          contentRating
        }
      : {
          releaseDate: formatShortDate(formatStringDate(details.release_date)) || 'TBD',
          duration: details.runtime ? formatRuntime(details.runtime) : 'N/A'
        })
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key} sx={{ display: 'inline', whiteSpace: 'pre-line' }}>
          <Typography sx={{ display: 'inline' }} color={color} paddingRight={1}>
            {sentenceCase(key)}:
          </Typography>
          <Typography sx={{ display: 'inline' }} color={color}>
            {value}
          </Typography>
        </Box>
      ))}
      {tab && (
        <React.Fragment>
          <Genres genres={details.genres} />
          <Tags id={details.id} mediaType={type} />
        </React.Fragment>
      )}
    </Box>
  );
};

export default DetailsSummary;
