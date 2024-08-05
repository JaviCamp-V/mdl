import React from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import { lookupShow } from '@/server/tvMazeActions';
import Iconify from '@/components/Icon/Iconify';
import { Episode } from '@/types/tmdb/ISeason';
import { createDate } from '@/utils/dateUtils';
import { formatTime } from '@/utils/formatters';
import Countdown from './Countdown';

interface NextEpisodeProps {
  tvdb_id: number | null;
  number_of_episodes: number;
  next_episode_to_air: Episode | null | undefined;
  containerStyle?: SxProps;
}

const NextEpisode: React.FC<NextEpisodeProps> = async ({
  tvdb_id,
  next_episode_to_air,
  number_of_episodes,
  containerStyle
}) => {
  if (!next_episode_to_air || !tvdb_id) return <Box />;
  const response = await lookupShow(tvdb_id);
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
        padding: 3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Iconify icon="simple-line-icons:calender" sx={{ color: '#1B92E4', fontSize: 48, width: 50, height: 50 }} />
        <Box>
          <Typography color="#a1aac1" fontSize={16}>
            {`Episode ${episode_number} of ${number_of_episodes} airing on`}
          </Typography>
          <Typography fontSize={16} fontWeight={500}>
            {formatTime(airsOn)}
          </Typography>
        </Box>
      </Box>
      <Countdown date={airsOn} />
    </Box>
  );
};

export default NextEpisode;
