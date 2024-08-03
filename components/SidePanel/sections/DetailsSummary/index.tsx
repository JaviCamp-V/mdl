import Genres from '@/components/GeneralDetails/tabs/Details/sections/Genres';
import Tags from '@/components/GeneralDetails/tabs/Details/sections/Tags';
import { getTVContentRating } from '@/server/tmdb2Actions';
import { lookupShow } from '@/server/tvMazeActions';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import { formatRuntime, formatShortDate, formatStringDate } from '@/utils/formatters';
import { Box, Typography } from '@mui/material';
import { sentenceCase } from 'change-case';
import React from 'react';

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
    contentRating = ratings
          ?.filter(({ iso_3166_1 })=> ['US', ...details.origin_country].includes(iso_3166_1))
          ?.map(({ rating }) => rating)
          ?.join(', ')
      || 'Not Yet Rated';
  }

  const data = {
    title: type === MediaType.movie ? details.title : details.name,
    country: details.production_countries.map(({ name }) => name).join(', '),
    ...(type === MediaType.tv
      ? {
          episodes: details.number_of_episodes,
          airs: `${details.first_air_date ? formatShortDate(formatStringDate(details.first_air_date)) : 'TBD'} - ${
            details.last_air_date ? formatShortDate(formatStringDate(details.last_air_date)) : 'TBD'
          }`,
          airsOn: daysAiring,
          originalNetwork: details.networks.map(({ name }) => name).join(', '),
          contentRating
        }
      : {
          releaseDate: formatShortDate(formatStringDate(details.release_date)),
          duration: details.runtime ? formatRuntime(details.runtime) : 'N/A'
        })
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key} sx={{ display: 'inline', whiteSpace: 'pre-line'}}>
          <Typography sx={{ display: 'inline' }} color="#fff"  paddingRight={1}>
            {sentenceCase(key)}:
          </Typography>
          <Typography sx={{ display: 'inline' }} color="#fff">
            {value}
          </Typography>
        </Box>
      ))}
      {tab && (
        <React.Fragment>
          <Box sx={{ display: 'inline', whiteSpace: 'pre-line'}}>
            <Typography sx={{ display: 'inline' }} color="#fff" fontWeight={500} paddingRight={1}>
              Genres:
            </Typography>
            <Genres genres={details.genres} />
          </Box>
          <Box sx={{ display: 'inline',whiteSpace: 'pre-line', paddingRight: 2 }}>
            <Typography sx={{ display: 'inline' }} color="#fff" fontWeight={500} paddingRight={1}>
              Tags:
            </Typography>
            <Tags id={details.id} mediaType={type} />
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default DetailsSummary;
