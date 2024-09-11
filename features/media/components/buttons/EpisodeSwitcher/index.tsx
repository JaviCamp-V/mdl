'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button } from '@mui/material';
import Iconify from '@/components/Icon/Iconify';
import MediaType from '@/types/enums/IMediaType';
import { formatDigitsWithPadding } from '@/utils/formatters';

interface EpisodeSwitcherButtonProps {
  mediaId: number;
  number_of_episodes: number;
  current_episode: number;
  number_of_seasons: number;
  current_season: number;
}
const padWithTwoDigits = (num: number) => {
  return formatDigitsWithPadding(num, 2);
};
const EpisodeSwitcherButton: React.FC<EpisodeSwitcherButtonProps> = ({
  number_of_episodes,
  current_episode,
  current_season,
  number_of_seasons,
  mediaId
}) => {
  const hasNextEpisode = current_season < number_of_seasons || current_episode < number_of_episodes;
  const hasPreviousEpisode = current_season > 1 || current_episode > 1;

  const router = useRouter();
  const baseUrl = `${MediaType.tv}/${mediaId}/episode-guide`;
  const onPrevEpisode = React.useCallback(() => {
    if (current_episode === 1) return router.push(`/${baseUrl}/s${current_season - 1}-ep_finale`);
    router.push(`/${baseUrl}/s${padWithTwoDigits(current_season)}-ep${padWithTwoDigits(current_episode - 1)}`);
  }, [current_episode, current_season]);

  const onNextEpisode = React.useCallback(() => {
    if (current_episode === number_of_episodes)
      return router.push(`/${baseUrl}/s${padWithTwoDigits(current_season + 1)}-ep01`);
    router.push(`/${baseUrl}/s${padWithTwoDigits(current_season)}-ep${padWithTwoDigits(current_episode + 1)}`);
  }, [current_episode, current_season]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent:
          hasNextEpisode && hasPreviousEpisode ? 'space-between' : hasPreviousEpisode ? 'flex-start' : 'flex-end'
      }}
    >
      {hasPreviousEpisode && (
        <Button
          onClick={onPrevEpisode}
          startIcon={<Iconify icon="mdi:arrow-left-circle" />}
          sx={{ textTransform: 'capitalize' }}
        >
          Previous Episode
        </Button>
      )}
      {hasNextEpisode && (
        <Button
          onClick={onNextEpisode}
          endIcon={<Iconify icon="mdi:arrow-right-circle" />}
          sx={{ textTransform: 'capitalize' }}
        >
          Next Episode
        </Button>
      )}
    </Box>
  );
};

export default EpisodeSwitcherButton;
