import React from 'react';
import Link from 'next/link';
import { Rating, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { getSeasonDetails } from '@/server/tmdbActions';
import DramaPoster from '@/components/Poster';
import { formatShortDate, formatStringDate } from '@/utils/formatters';

interface EpisodeGuideProps {
  id: number;
  season_number: number;
  name: string;
}

const hasAired = (date: string) => formatStringDate(date).getTime() < new Date().getTime();
const EpisodeGuide: React.FC<EpisodeGuideProps> = async ({ id, name, season_number }) => {
  const season = await getSeasonDetails(id, season_number);
  if (!season) {
    return <Box p={2}>Episodes Not Found</Box>;
  }
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
            <Box sx={{ width: '100%', height: '40vh' }}>
              <DramaPoster
                src={episode.still_path}
                id={`${season_number}/${episode.id}`}
                mediaType="episode"
                size="original"
              />
            </Box>
            <Box>
              <Link href={`/episode/${season_number}/${id}`} style={{ textDecoration: 'none' }}>
                <Typography color="primary" fontWeight={500}>{`${name}: ${episode.name}`}</Typography>
              </Link>
              <Rating name="read-only" value={episode.vote_average / 2} precision={0.1} readOnly />
              <Typography>{`${episode.vote_average}/10 from ${episode.vote_count} users`}</Typography>
              <Typography>{formatShortDate(formatStringDate(episode.air_date))}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EpisodeGuide;
