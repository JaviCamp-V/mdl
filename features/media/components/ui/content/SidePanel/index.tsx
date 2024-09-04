import React from 'react';
import MovieDetails from '@/features/media/types/interfaces/MovieDetails';
import TVDetails from '@/features/media/types/interfaces/TVDetails';
import { Box, SxProps } from '@mui/material';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MediaType from '@/types/enums/IMediaType';
import MediaLinks from '../MediaLinks';
import DetailsCard from './DetailsCard';

interface SidePanelProps extends MediaDetailsProps {
  details: TVDetails | MovieDetails;
  notDetails?: boolean;
  cardStyle?: SxProps;
}
const SidePanel: React.FC<SidePanelProps> = ({ details, notDetails, mediaId, mediaType, cardStyle }) => {
  const anyDetails = details as any;
  const title = mediaType === MediaType.movie ? anyDetails.title : anyDetails.name;
  const year = mediaType === MediaType.movie ? anyDetails.release_date : anyDetails.first_air_date;
  const runtime = mediaType === MediaType.movie ? anyDetails.runtime : anyDetails.episode_run_time;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {notDetails && (
        <Box sx={{ ...cardStyle, padding: 2 }}>
          <MediaLinks
            poster_path={details.poster_path}
            external_ids={details.external_ids}
            watchStatus={details.watchStatus}
            recordId={details.recordId}
            number_of_episodes={anyDetails?.number_of_episodes}
            lastEpisodeType={anyDetails?.last_episode_to_air?.episode_type}
            runtime={runtime}
            mediaType={mediaType}
            mediaId={mediaId}
            title={title}
            release_date={year}
          />
        </Box>
      )}

      <DetailsCard
        external_ids={details.external_ids}
        number_of_episodes={anyDetails?.number_of_episodes}
        title={title}
        origin_country={details.origin_country}
        release_date={year}
        last_air_date={anyDetails?.last_air_date}
        networks={details.production_companies}
        runtime={0}
        genres={details.genres}
        mediaType={mediaType}
        mediaId={mediaId}
        withCategory={notDetails}
      />
    </Box>
  );
};

export default SidePanel;
