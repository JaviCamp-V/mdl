import React from 'react';
import AddToCustomList from '@/features/custom_lists/components/buttons/AddToList';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import WatchStatusButton from '@/features/watchlist/components/buttons/WatchStatusButton';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import DramaPoster from '@/components/Poster';
import Socials from '@/components/Socials';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import WatchStatus from '@/types/enums/WatchStatus';
import WatchButtons from './WatchButtons';

interface MediaLinksProps extends MediaDetailsProps {
  poster_path: string | null;
  external_ids: ExternalID;
  watchStatus: WatchStatus | null;
  recordId: number | null;
  runtime: number | number[] | null | undefined;
  title: string;
  release_date: string | null;
  number_of_episodes: number;
  lastEpisodeType: string | null | undefined;
}
const MediaLinks: React.FC<MediaLinksProps> = ({
  poster_path,
  external_ids,
  watchStatus,
  recordId,
  mediaId,
  mediaType,
  title,
  runtime,
  release_date,
  number_of_episodes,
  lastEpisodeType
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ width: '100%', height: { xs: '70vh', sm: '50vh' } }}>
        <DramaPoster src={poster_path} id={mediaId} mediaType={mediaType} size="original" />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '90%'
        }}
      >
        <Socials {...external_ids} />
      </Box>
      <WatchButtons mediaId={mediaId} mediaType={mediaType} />
      <ButtonGroup variant="contained" sx={{ width: '100%' }} size="large">
        <WatchStatusButton
          id={mediaId}
          mediaType={mediaType}
          watchStatus={watchStatus}
          recordId={recordId}
          runtime={mediaType === 'movie' ? (runtime as number) : 0}
          poster_path={poster_path}
          title={title}
          release_date={release_date}
          number_of_episodes={number_of_episodes}
          lastEpisodeType={lastEpisodeType}
        />
        <AddToCustomList />
      </ButtonGroup>
    </Box>
  );
};

export default MediaLinks;
