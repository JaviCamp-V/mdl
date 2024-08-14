'use client';

import React from 'react';
import { capitalCase } from 'change-case';
import { enqueueSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import { getWatchlistRecord } from '@/server/watchlistActions';
import WatchlistRecordModal from '@/components/Modals/WatchListRecord';
import MediaType from '@/types/tmdb/IMediaType';
import MovieDetails from '@/types/tmdb/IMovieDetails';
import TVDetails from '@/types/tmdb/ITVDetails';
import WatchlistRecord from '@/types/watchlist/IWatchlistRecord';
import WatchStatus from '@/types/watchlist/WatchStatus';

interface WatchStatusButtonProps {
  id: number;
  mediaType: MediaType;
  watchStatus: WatchStatus | null;
  recordId: number | null;
  mediaData: TVDetails | MovieDetails;
}

const WatchStatusButton: React.FC<WatchStatusButtonProps> = ({ mediaData, id, mediaType, recordId, watchStatus }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [watchRecord, setWatchRecord] = React.useState<WatchlistRecord | null>(null);
  const handleClose = () => {
    setIsModalOpen(false);
    setWatchRecord(null);
  };

  const handleClick = async () => {
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
    <React.Fragment>
      <Button variant="contained" sx={{ width: '75%', textTransform: 'none', fontSize: 14, whiteSpace: "nowrap"
        }} onClick={handleClick}>
        {watchStatus ? capitalCase(watchStatus) : 'Add to List'}
      </Button>
      {isModalOpen && (
        <WatchlistRecordModal
          open={isModalOpen}
          onClose={handleClose}
          mediaType={mediaType}
          id={id}
          mediaData={mediaData}
          record={watchRecord}
        />
      )}
    </React.Fragment>
  );
};

export default WatchStatusButton;
