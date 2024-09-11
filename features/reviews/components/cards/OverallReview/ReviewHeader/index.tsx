import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserSummary from '@/types/common/UserSummary';
import MediaType from '@/types/enums/IMediaType';
import WatchStatus from '@/types/enums/WatchStatus';
import { formatDateToDistance } from '@/utils/formatters';
import OverallReviewWatchStatus from '../../OverallReviewWatchStatus';
import ReviewHelpfulRatingUserCard from '../../ReviewHelpfulRatingUser';

interface ReviewHeaderProps {
  mediaType: MediaType.tv | MediaType.movie;
  reviewId: number;
  numberOfHelpfulReviews: number;
  createdAt: string;
  isHelpful: boolean | null | undefined;
  totalEpisodes?: number;
  user: UserSummary;
  commentCount: number;
  watchStatus: WatchStatus | null;
  episodeWatched: number | null;
  hasCompleted: boolean;
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({
  mediaType,
  reviewId: id,
  numberOfHelpfulReviews,
  createdAt,
  isHelpful,
  totalEpisodes,
  user,
  commentCount,
  watchStatus,
  episodeWatched,
  hasCompleted
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
      <ReviewHelpfulRatingUserCard user={user} numberOfHelpfulReviews={numberOfHelpfulReviews} isHelpful={isHelpful} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 0.2 }}
      >
        <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6, display: { xs: 'none', md: 'flex' } }}>
          {formatDateToDistance(createdAt)}
        </Typography>
        <OverallReviewWatchStatus
          mediaType={mediaType}
          reviewId={id}
          totalEpisodes={totalEpisodes}
          username={user.username}
          commentCount={commentCount}
          watchStatus={watchStatus}
          episodeWatched={episodeWatched}
          hasCompleted={hasCompleted}
        />
      </Box>
    </Box>
  );
};

export default ReviewHeader;
