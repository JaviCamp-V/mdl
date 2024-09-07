import React from 'react';
import { getTVContentRating } from '@/features/media/service/tmdbService';
import { lookupShow } from '@/features/media/service/tvMazeService';
import Network from '@/features/media/types/interfaces/Network';
import { sentenceCase } from 'change-case';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { formatRuntime, formatShortDate, formatStringDate } from '@/utils/formatters';
import countries from '@/libs/countries';
import routes from '@/libs/routes';
import MultiLinkText from '../../../typography/MultiLinkText';

interface MetaDetailsProps extends MediaDetailsProps {
  tvdb_id: number | null;
  imdb_id: string | null;
  number_of_episodes: number;
  title: string;
  origin_country: string[];
  release_date: string | null | undefined;
  last_air_date: string | null | undefined;
  networks: Network[];
  runtime: number | number[];
}

const getAiringTime = async (tvdb_id: number | null, imdb_id: string | null) => {
  if (!tvdb_id && !imdb_id) return 'N/A';
  const id = tvdb_id ?? imdb_id;
  const source = tvdb_id ? 'thetvdb' : 'imdb';
  const response = await lookupShow(id!, source);
  return response?.schedule?.days.join(', ') ?? 'N/A';
};

const getContentRating = async (mediaId: number, origin_country: string[]) => {
  const ratings = await getTVContentRating(mediaId);
  return (
    ratings
      ?.filter(({ iso_3166_1 }) => ['US', ...origin_country].includes(iso_3166_1))
      ?.map(({ rating }) => rating)
      ?.join(', ') || 'Not Yet Rated'
  );
};

const getDuration = (runtime: number | number[] | null | undefined) => {
  const runtimes = Array.isArray(runtime) ? runtime : [runtime];
  const duration = runtimes
    ?.filter((r) => r)
    ?.map((r) => formatRuntime(r!))
    .join(', ');
  return duration || 'N/A';
};

const formatReleaseDate = (date: string | null | undefined) => {
  return date ? formatShortDate(formatStringDate(date)) : 'TBD';
};
const mapTvDetails = async (props: MetaDetailsProps) => {
  const airsOn = await getAiringTime(props.tvdb_id, props.imdb_id);
  const contentRating = await getContentRating(props.mediaId, props.origin_country);
  const episodes = props.number_of_episodes || 'N/A';
  const airs = `${formatReleaseDate(props.release_date)} - ${formatReleaseDate(props.last_air_date)}`;
  const duration = getDuration(props.runtime);
  const originalNetwork = props.networks?.map((network) => ({
    label: network.name,
    href: `${routes.search}?type=${props.mediaType}&with_companies=${network.id}_${network.name}`
  }));
  return { episodes, airs, airsOn, duration, originalNetwork, contentRating };
};

const mapMovieDetails = (props: MetaDetailsProps) => {
  const releaseDate = formatReleaseDate(props.release_date);
  const duration = getDuration(props.runtime);
  return { releaseDate, duration };
};

const MetaDetails: React.FC<MetaDetailsProps> = async (props) => {
  const details = props.mediaType === 'tv' ? await mapTvDetails(props) : mapMovieDetails(props);
  const country =
    props.origin_country
      .map((code) => countries.find((country) => country.code === code)?.fullName ?? code)
      .join(', ') || 'N/A';

  const data = {
    [props.mediaType === 'tv' ? 'Drama' : 'Movie']: props.title,
    country,
    ...details
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {Object.entries(data).map(([key, value]) => (
        <Box key={key} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <Typography fontSize={14} paddingRight={1} fontWeight={'bolder'}>
            {sentenceCase(key)}:
          </Typography>
          {key === 'originalNetwork' ? (
            <MultiLinkText links={value as any} />
          ) : (
            <Typography fontSize={14}>{value as string}</Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MetaDetails;
