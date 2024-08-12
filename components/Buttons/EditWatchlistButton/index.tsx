'use client';

import React from 'react';
import { enqueueSnackbar } from 'notistack';
import { Box, ClickAwayListener } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { getMovieDetails, getTVDetails } from '@/server/tmdbActions';
import { getWatchlistRecord } from '@/server/watchlistActions';
import Iconify from '@/components/Icon/Iconify';
import WatchlistRecordModal from '@/components/Modals/WatchListRecord';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';

interface EditWatchlistButtonProps {
  type: MediaType;
  id: number;
  recordId: number | null;
  icon?: string | React.ReactNode;
}
const icons = { edit: 'mdi:edit-outline', add: 'mdi:add' };
const EditWatchlistButton: React.FC<EditWatchlistButtonProps> = ({ type, id, recordId, icon }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mediaData, setMediaData] = React.useState<TVDetails | MovieDetails>();
  const [watchRecord, setWatchRecord] = React.useState<WatchlistRecord | null>(null);
  const handleClose = () => {
    setIsModalOpen(false);
    setWatchRecord(null);
  };

  const handleClick = async () => {
    const mediaResponse = type === MediaType.tv ? await getTVDetails(id) : await getMovieDetails(id);
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
          mediaData={mediaData}
          record={watchRecord}
        />
      )}
    </Box>
  );
};

export default EditWatchlistButton;
