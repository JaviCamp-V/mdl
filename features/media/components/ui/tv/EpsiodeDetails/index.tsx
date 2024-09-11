import React from 'react';
import { Episode } from '@/features/media/types/interfaces/Season';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DramaPoster from '@/components/Poster';
import Divider from '@/components/common/Divider';
import MediaType from '@/types/enums/IMediaType';
import { formatDigitsWithPadding, formatShortDate, formatStringDate } from '@/utils/formatters';
import EpisodeSwitcherButton from '../../../buttons/EpisodeSwitcher';
import ContentScore from '../../content/ContentScore';

interface EpisodeDetailsProps {
  episode: Episode;
  season_name: string;
  drama_name: string;
  number_of_season: number;
  number_of_episodes: number;
}
const EpisodeDetails: React.FC<EpisodeDetailsProps> = ({
  episode,
  drama_name,
  season_name,
  number_of_episodes,
  number_of_season
}) => {
  return (
    <Grid container spacing={3} sx={{ width: '100%', paddingX: 2 }}>
      <Grid item xs={12} sm={5} md={4} sx={{}}>
        <Box sx={{ width: '100%', height: { xs: '70vh', sm: '45vh', md: '50vh', lg: '55vh' } }}>
          <DramaPoster
            src={episode.still_path}
            id={`${episode.show_id}/episode-guide/s${formatDigitsWithPadding(episode.season_number, 2)}-ep${formatDigitsWithPadding(episode.episode_number, 2)}`}
            mediaType={MediaType.tv}
            size="w780"
          />
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <Typography fontSize={16} fontWeight={700} color="primary">
          {`${drama_name} - ${season_name} ${episode.name}`}
        </Typography>
        <Typography fontSize={14} sx={{ opacity: 0.6 }}>
          {episode.air_date ? formatShortDate(formatStringDate(episode.air_date)) : 'TBA'}
        </Typography>
        <Divider />

        <ContentScore
          vote_average={episode.vote_average}
          vote_count={episode.vote_count}
          number_of_reviews={0}
          recordRating={0}
        />
        <Typography fontSize={14}>{episode.overview}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
        <EpisodeSwitcherButton
          mediaId={episode.show_id}
          number_of_episodes={number_of_episodes}
          current_episode={episode.episode_number}
          number_of_seasons={number_of_season}
          current_season={episode.season_number}
        />
      </Grid>
    </Grid>
  );
};

export default EpisodeDetails;
