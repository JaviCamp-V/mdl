'use server';

import React from 'react';
import { getSeasonDetails } from '@/features/media/service/tmdbViewService';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DramaPoster from '@/components/Poster';
import Divider from '@/components/common/Divider';
import Link from '@/components/common/Link';
import NotFound from '@/components/common/NotFound';
import Ratings from '@/components/common/Ratings';
import MediaType from '@/types/enums/IMediaType';
import { formatDigitsWithPadding, formatShortDate, formatStringDate } from '@/utils/formatters';
import EpisodeDetails from '../EpsiodeDetails';

interface EpisodeGuideProps {
  id: number;
  number_of_season: number;
  season_number: number;
  episode_number: number;
  name: string;
}
const hasAired = (date: string) => formatStringDate(date).getTime() < new Date().getTime();
const EpisodeGuide: React.FC<EpisodeGuideProps> = async ({
  id,
  name,
  number_of_season,
  season_number,
  episode_number
}) => {
  if (season_number && episode_number) {
    const seasonDetails = await getSeasonDetails(id, season_number);
    if (!seasonDetails) return <NotFound type="episode guide" />;
    const episodeDetails = seasonDetails?.episodes.find((ep) => ep.episode_number === episode_number);
    if (!episodeDetails) return <NotFound type="episode guide" />;
    return (
      <EpisodeDetails
        drama_name={name}
        season_name={seasonDetails.name}
        number_of_season={number_of_season}
        number_of_episodes={seasonDetails.episodes.length}
        episode={episodeDetails}
      />
    );
  }

  const seasons = await Promise.all([...Array(number_of_season)].map((_, i) => getSeasonDetails(id, i + 1)));

  const filteredSeasons = seasons.filter((season) => season !== null && Object.keys(season).length > 0);
  if (filteredSeasons.length === 0) return <NotFound type="episode guide" />;

  return (
    <Box padding={2}>
      <Grid container spacing={2} sx={{ width: '100%', marginRight: 2 }}>
        {filteredSeasons.map((season) => (
          <Grid item xs={12} key={season?.id}>
            <Typography fontSize={16} fontWeight={700} color="primary" marginBottom={2}>
              {`${name} - ${season?.name}`}
            </Typography>
            <Grid container spacing={2}>
              {season.episodes.map((episode) => (
                <Grid
                  item
                  key={episode.id}
                  xs={12}
                  sm={6}
                  md={4}
                  sx={{
                    ...(hasAired(episode.air_date)
                      ? { opacity: 1, cursor: 'pointer', pointerEvents: 'auto' }
                      : {
                          opacity: 0.6,
                          pointerEvents: 'none',
                          cursor: 'not-allowed'
                        })
                  }}
                >
                  <Box sx={{ width: '100%', height: '35vh' }}>
                    <DramaPoster
                      src={episode.still_path}
                      id={`${episode.show_id}/episode-guide/s${formatDigitsWithPadding(episode.season_number, 2)}-ep${formatDigitsWithPadding(episode.episode_number, 2)}`}
                      mediaType={MediaType.tv}
                      size="w780"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Link
                      href={`/tv/${episode.show_id}/episode-guide/s${formatDigitsWithPadding(episode.season_number, 2)}-ep${formatDigitsWithPadding(episode.episode_number, 2)}`}
                      sx={{ fontWeight: 700, fontSize: 14 }}
                    >{`${number_of_season > 1 ? `Season ${season.season_number}` : name} - ${episode.name}`}</Link>
                    <Ratings rating={episode.vote_average} sx={{ justifyContent: 'left' }} />
                    <Typography
                      fontSize={14}
                    >{`${episode.vote_average}/10 from ${episode.vote_count} users`}</Typography>
                    <Typography fontSize={14}>{formatShortDate(formatStringDate(episode.air_date))}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {number_of_season !== season.season_number && <Divider />}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EpisodeGuide;
