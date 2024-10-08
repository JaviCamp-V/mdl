import React from 'react';
import { lookupShow } from '@/features/media/service/tvMazeService';
import { Episode } from '@/features/media/types/interfaces/Season';
import { Box, SxProps, Typography } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import { createDate } from '@/utils/dateUtils';
import { formatTime } from '@/utils/formatters';
import Countdown from './Countdown';

interface NextEpisodeProps {
  tvdb_id: number | null;
  imdb_id: string | null;
  number_of_episodes: number;
  next_episode_to_air: Episode | null | undefined;
  containerStyle?: SxProps;
}

const NextEpisode: React.FC<NextEpisodeProps> = async ({
  tvdb_id,
  imdb_id,
  next_episode_to_air,
  number_of_episodes,
  containerStyle
}) => {
  if (!next_episode_to_air || (!tvdb_id && !imdb_id)) return <Box />;
  const response = await lookupShow(tvdb_id ? tvdb_id! : imdb_id!, tvdb_id ? 'thetvdb' : 'imdb');
  const airTime = response?.schedule?.time;
  const timezone = response?.network?.country?.timezone;
  const airDate = next_episode_to_air?.air_date;
  const episode_number = next_episode_to_air?.episode_number;
  if (!airTime || !airDate || !timezone) return <Box />;
  const airsOn = createDate(airDate, airTime, timezone);
  if (airsOn < new Date()) return <Box />;

  return (
    <Box
      sx={{
        ...containerStyle,
        padding: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 1, sm: 0 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Iconify icon="mdi:calendar-month" sx={{ color: '#1B92E4', fontSize: 48, width: 50, height: 50 }} />
        <Box>
          <Typography color="#a1aac1" fontSize={16}>
            {`Episode ${episode_number} of ${number_of_episodes} airing on`}
          </Typography>
          <Typography fontSize={16} fontWeight={700}>
            {formatTime(airsOn)}
          </Typography>
        </Box>
      </Box>
      <Countdown date={airsOn} />
    </Box>
  );
};

export default NextEpisode;
