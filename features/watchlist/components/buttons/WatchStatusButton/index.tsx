'use client';

import React from 'react';
import { getUserWatchlistRecordById } from '@/features/watchlist/service/watchlistViewService';
import WatchlistRecord from '@/features/watchlist/types/interfaces/WatchlistRecord';
import { capitalCase } from 'change-case';
import { enqueueSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import WatchlistRecordModal from '../../modals/WatchListRecord';

interface WatchStatusButtonProps {
  id: number;
  mediaType: MediaType.tv | MediaType.movie;
  watchStatus: WatchStatus | null;
  recordId: number | null;
  runtime: number | null | undefined;
  poster_path: string | null;
  title: string;
  release_date: string | null;
  number_of_episodes: number;
  lastEpisodeType: string | null | undefined;
}

const WatchStatusButton: React.FC<WatchStatusButtonProps> = ({
  id,
  mediaType,
  recordId,
  watchStatus,
  runtime,
  poster_path,
  title,
  release_date,
  number_of_episodes,
  lastEpisodeType
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [watchRecord, setWatchRecord] = React.useState<WatchlistRecord | null>(null);
  const handleClose = () => {
    setIsModalOpen(false);
    setWatchRecord(null);
  };

  const handleClick = async () => {
    if (recordId) {
      const recordResponse = await getUserWatchlistRecordById(recordId);
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
      <Button
        variant="contained"
        sx={{ width: '75%', textTransform: 'none', fontSize: 14, whiteSpace: 'nowrap', fontWeight: 700 }}
        onClick={handleClick}
      >
        {watchStatus ? capitalCase(watchStatus) : 'Add to List'}
      </Button>
      {isModalOpen && (
        <WatchlistRecordModal
          open={isModalOpen}
          onClose={handleClose}
          mediaType={mediaType}
          id={id}
          record={watchRecord}
          runtime={runtime}
          poster_path={poster_path}
          title={title}
          release_date={release_date}
          number_of_episodes={number_of_episodes}
          lastEpisodeType={lastEpisodeType}
        />
      )}
    </React.Fragment>
  );
};

export default WatchStatusButton;
