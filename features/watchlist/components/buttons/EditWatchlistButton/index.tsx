'use client';

import React from 'react';
import { getContentDetails } from '@/features/media/service/tmdbService';
import MovieDetails from '@/features/media/types/interfaces/MovieDetails';
import TVDetails from '@/features/media/types/interfaces/TVDetails';
import { getWatchlistRecord } from '@/features/watchlist/service/watchlistService';
import WatchlistRecord from '@/features/watchlist/types/interfaces/WatchlistRecord';
import { useSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Iconify from '@/components/Icon/Iconify';
import MediaType from '@/types/enums/IMediaType';
import WatchlistRecordModal from '../../modals/WatchListRecord';

interface EditWatchlistButtonProps {
  type: MediaType.tv | MediaType.movie;
  id: number;
  recordId: number | null;
  icon?: string | React.ReactNode;
}
const icons = { edit: 'mdi:edit-outline', add: 'mdi:add' };
const EditWatchlistButton: React.FC<EditWatchlistButtonProps> = ({ type, id, recordId, icon }) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mediaData, setMediaData] = React.useState<TVDetails | MovieDetails>();
  const [watchRecord, setWatchRecord] = React.useState<WatchlistRecord | null>(null);
  const handleClose = () => {
    setIsModalOpen(false);
    setWatchRecord(null);
  };

  if (!session?.user) return;

  const handleClick = async () => {
    const mediaResponse = await getContentDetails(type, id, false);
    if (mediaResponse === null) {
      enqueueSnackbar(`Error fetching ${type === MediaType.tv ? 'drama' : 'movie'} details`, { variant: 'error' });
      return;
    }
    setMediaData(mediaResponse);

    if (recordId) {
      const recordResponse = await getWatchlistRecord(recordId);
      if (recordResponse && 'errors' in recordResponse) {
        enqueueSnackbar('Error fetching watchlist record', { variant: 'error' });
        return;
      }
      setWatchRecord(recordResponse);
    }

    setIsModalOpen(true);
  };

  return (
    <Box>
      <IconButton
        color="primary"
        onClick={handleClick}
        sx={(theme) => ({
          borderRadius: '3px!important',
          overflow: 'hidden',
          paddingY: 0,
          paddingX: 0.5,
          backgroundColor: `${theme.palette.info.main}!important`,
          border: `1px solid ${theme.palette.background.default}!important`
        })}
      >
        {icon ?? <Iconify icon={recordId ? icons.edit : icons.add} sx={{ width: 16, height: 16 }} />}
      </IconButton>
      {isModalOpen && mediaData && (
        <WatchlistRecordModal
          open={isModalOpen}
          onClose={handleClose}
          mediaType={type}
          id={id}
          record={watchRecord}
          runtime={(mediaData as MovieDetails)?.runtime}
          poster_path={mediaData.poster_path}
          title={(mediaData as MovieDetails)?.title ?? (mediaData as TVDetails).name}
          release_date={(mediaData as MovieDetails)?.release_date ?? (mediaData as TVDetails).first_air_date}
          number_of_episodes={(mediaData as TVDetails)?.number_of_episodes ?? 1}
          lastEpisodeType={(mediaData as TVDetails)?.last_episode_to_air?.episode_type}
        />
      )}
    </Box>
  );
};

export default EditWatchlistButton;