import React from 'react';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Ratings from '@/components/common/Ratings';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import WatchStatus from '@/types/enums/WatchStatus';
import { formatDateToDistance } from '@/utils/formatters';
import OverallReviewWatchStatus from '../../OverallReviewWatchStatus';
import ReviewHelpfulRatingMediaCard from '../../ReviewHelpfulRatingMedia';

interface ReviewHeaderProps extends MediaDetailsProps {
  poster_path: string | null;
  title: string;
  reviewType: ReviewType;
  reviewId: number;
  numberOfHelpfulReviews: number;
  createdAt: string;
  isHelpful: boolean | null | undefined;
  totalEpisodes?: number;
  username: string;
  commentCount: number;
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
  hasCompleted: boolean;
  overallRating: number;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  mediaType,
  mediaId,
  poster_path,
  title,
  reviewId: id,
  numberOfHelpfulReviews,
  createdAt,
  isHelpful,
  totalEpisodes,
  username,
  commentCount,
  watchStatus,
  episodeWatched,
  hasCompleted,
  reviewType,
  overallRating
}) => {
  return (
    <Box
      id={`review-${id}`}
      sx={{
        paddingX: { xs: 1, md: 2 },
        paddingY: 1.5,
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <ReviewHelpfulRatingMediaCard
        title={title}
        mediaId={mediaId}
        mediaType={mediaType}
        poster_path={poster_path}
        username={username}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        isHelpful={isHelpful}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: 0.2,
          width: '50%'
        }}
      >
        <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6, display: { xs: 'none', md: 'flex' } }}>
          {formatDateToDistance(createdAt)}
        </Typography>
        {reviewType === ReviewType.OVERALL ? (
          <OverallReviewWatchStatus
            mediaType={mediaType}
            reviewId={id}
            totalEpisodes={totalEpisodes}
            username={username}
            commentCount={commentCount}
            watchStatus={watchStatus}
            episodeWatched={episodeWatched}
            hasCompleted={hasCompleted}
          />
        ) : (
          <Ratings rating={overallRating} />
        )}
      </Box>
    </Box>
  );
};

export default ReviewHeader;
