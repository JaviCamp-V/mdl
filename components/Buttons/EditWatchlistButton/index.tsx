'use client';

import React from 'react';
import { Box, ClickAwayListener } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { getWatchlistRecord } from '@/server/watchlistActions';
import Iconify from '@/components/Icon/Iconify';
import WatchlistRecordModal from '@/components/Modals/WatchListRecord';
import MediaType from '@/types/tmdb/IMediaType';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';

interface EditWatchlistButtonProps {
  type: MediaType;
  id: number;
  poster_path: string | null;
  title: string;
  year: string | number;
  recordId: number | null;
  // Add watchlist record
}
const icons = { edit: 'mdi:edit-outline', add: 'mdi:add' };
const EditWatchlistButton: React.FC<EditWatchlistButtonProps> = ({ type, id, poster_path, title, year, recordId }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [watchRecord, setWatchRecord] = React.useState<WatchlistRecord | null>(null);
  const handleClose = () => {
    setIsModalOpen(false);
    setWatchRecord(null);
  };

  console.log('recordId: ', recordId);
  const handleClick = async () => {
    if (!recordId) return setIsModalOpen(true);
    console.log('fetching watchlist record');
    const response = await getWatchlistRecord(recordId);
    if (response && 'errors' in response) {
      console.error('Error fetching watchlist record: ', response);
      return;
    }
    setWatchRecord(response);
    setIsModalOpen(true);
  };

  return (
    // <ClickAwayListener onClickAway={() => setIsModalOpen(false)}>
    <Box>
      <IconButton
        color="primary"
        onClick={handleClick}
        sx={{
          borderRadius: '3px!important',
          overflow: 'hidden',
          paddingY: 0,
          paddingX: 0.5,
          backgroundColor: '#3a3b3c!important',
          border: '1px solid #3e4042!important'
        }}
      >
        <Iconify icon={recordId ? icons.edit : icons.add} sx={{ width: 16, height: 16 }} />
      </IconButton>
      {isModalOpen && (
        <WatchlistRecordModal
          open={isModalOpen}
          onClose={handleClose}
          mediaType={type}
          id={id}
          poster_path={poster_path}
          title={title}
          year={year}
          record={watchRecord}
        />
      )}
    </Box>
    // </ClickAwayListener>
  );
};

export default EditWatchlistButton;
