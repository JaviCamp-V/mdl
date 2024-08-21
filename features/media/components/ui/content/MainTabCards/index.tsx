import React from 'react';
import Credits from '@/features/media/components/ui/content/Credits';
import Photos from '@/features/media/components/ui/content/Photos';
import NextEpisode from '@/features/media/components/ui/tv/NextEpisode';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import { Episode } from '@/features/media/types/interfaces/Season';
import ReviewDetails from '@/features/reviews/components/ui/ReviewDetails';
import { Box, SxProps } from '@mui/material';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MediaType from '@/types/enums/IMediaType';
import WhereToWatch from '../WhereToWatch';

interface ContentCardsProps extends MediaDetailsProps {
  title: string;
  external_ids: ExternalID;
  number_of_episodes: number;
  next_episode_to_air: Episode | null | undefined;
  cardStyle?: SxProps;
}

const view = 'overview';
const ContentCards: React.FC<ContentCardsProps> = ({
  mediaId,
  mediaType,
  number_of_episodes,
  title,
  external_ids,
  next_episode_to_air,
  cardStyle
}) => {
  const cards = {
    cast_overview: <Credits mediaId={mediaId} mediaType={mediaType} view={view} />,
    photos_overview: <Photos mediaId={mediaId} mediaType={mediaType} view={view} />,
    reviews: <ReviewDetails mediaType={mediaType} mediaId={mediaId} section={view} totalEpisodes={number_of_episodes} />
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {mediaType === MediaType.tv && (
        <NextEpisode
          tvdb_id={external_ids.tvdb_id}
          imdb_id={external_ids.imdb_id}
          number_of_episodes={number_of_episodes}
          next_episode_to_air={next_episode_to_air}
          containerStyle={cardStyle}
        />
      )}
      <WhereToWatch title={title} mediaType={mediaType} mediaId={mediaId}           containerStyle={cardStyle}
 />

      {Object.entries(cards).map(([key, value]) => (
        <Box key={key} sx={{ ...cardStyle }}>
          {value}
        </Box>
      ))}
    </Box>
  );
};

export default ContentCards;
