'use server';

import React from 'react';
import { getSeasonDetails } from '@/features/media/service/tmdbService';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DramaPoster from '@/components/Poster';
import Link from '@/components/common/Link';
import NotFound from '@/components/common/NotFound';
import Ratings from '@/components/common/Ratings';
import { formatShortDate, formatStringDate } from '@/utils/formatters';

interface EpisodeGuideProps {
  id: number;
  season_number: number;
  name: string;
}
const hasAired = (date: string) => formatStringDate(date).getTime() < new Date().getTime();
const EpisodeGuide: React.FC<EpisodeGuideProps> = async ({ id, name, season_number }) => {
  const season = await getSeasonDetails(id, season_number);
  if (!season) return <NotFound type="episode guide" />;

  return (
    <Box padding={2}>
      <Grid container spacing={2} sx={{ width: '100%', marginRight: 2 }}>
        {season.episodes.map((episode) => (
          <Grid
            item
            key={episode.id}
            xs={12}
            sm={6}
            md={4}
            sx={{
              ...(hasAired(episode.air_date)
                ? { opacity: 1 }
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
                id={`${season_number}/${episode.id}`}
                mediaType="episode"
                size="w780"
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link
                href={`/episode/${season_number}/${id}`}
                sx={{ fontWeight: 700, fontSize: 14 }}
              >{`${name}: ${episode.name}`}</Link>
              <Ratings rating={episode.vote_average} sx={{ justifyContent: 'left' }} />
              <Typography fontSize={14}>{`${episode.vote_average}/10 from ${episode.vote_count} users`}</Typography>
              <Typography fontSize={14}>{formatShortDate(formatStringDate(episode.air_date))}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EpisodeGuide;
