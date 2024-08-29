import React from 'react';
import CommentsSection from '@/features/comments/components/ui/CommentsSection';
import CommentType from '@/features/comments/types/enums/CommentType';
import { mapMediaTypeToCommentType } from '@/features/comments/utils/mapper';
import Credits from '@/features/media/components/ui/content/Credits';
import Photos from '@/features/media/components/ui/content/Photos';
import NextEpisode from '@/features/media/components/ui/tv/NextEpisode';
import ExternalID from '@/features/media/types/interfaces/ExternalID';
import { Episode } from '@/features/media/types/interfaces/Season';
import RecommendationDetails from '@/features/recommendations/components/ui/RecDetails';
import ReviewDetails from '@/features/reviews/components/ui/ReviewDetails';
import { Box, SxProps } from '@mui/material';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
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
    reviews: (
      <ReviewDetails mediaType={mediaType} mediaId={mediaId} section={view} totalEpisodes={number_of_episodes} />
    ),
    recommendations: <RecommendationDetails mediaId={mediaId} mediaType={mediaType} section={view} />,
    comments: <CommentsSection commentType={mapMediaTypeToCommentType(mediaType)} parentId={mediaId} />
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {mediaType === MediaType.tv && (
        <React.Suspense fallback={<LoadingSkeleton />}>
          <NextEpisode
            tvdb_id={external_ids.tvdb_id}
            imdb_id={external_ids.imdb_id}
            number_of_episodes={number_of_episodes}
            next_episode_to_air={next_episode_to_air}
            containerStyle={cardStyle}
          />
        </React.Suspense>
      )}
      <React.Suspense fallback={<LoadingSkeleton />}>
        <WhereToWatch title={title} mediaType={mediaType} mediaId={mediaId} containerStyle={cardStyle} />
      </React.Suspense>

      {Object.entries(cards).map(([key, value]) => (
        <Box key={key} sx={{ ...cardStyle }}>
          <React.Suspense fallback={<LoadingSkeleton />}> {value} </React.Suspense>
        </Box>
      ))}
    </Box>
  );
};

export default ContentCards;