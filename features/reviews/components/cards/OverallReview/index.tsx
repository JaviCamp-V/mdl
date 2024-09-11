import React from 'react';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { Box } from '@mui/material';
import AddHelpfulRatingButtons from '../../buttons/AddHelpfulRating';
import ReviewRatingCard from '../Ratings';
import ReviewBody from '../ReviewBody';
import ReviewHeader from './ReviewHeader';

interface OverallReviewCardProps {
  review: ExtendOverallReview;
  totalEpisodes?: number;
}

const OverallReviewCard: React.FC<OverallReviewCardProps> = ({ review, totalEpisodes }) => {
  const {
    user,
    id,
    watchStatus,
    episodeWatched,
    createdAt,
    helpful: { numberOfHelpfulReviews, isHelpful },
    mediaType,
    mediaId,
    reviewType,
    commentCount,
    headline,
    content,
    storyRating,
    actingRating,
    musicRating,
    overallRating,
    rewatchValueRating,
    hasSpoilers,
    hasCompleted
  } = review;

  return (
    <Box sx={{ width: '100%' }}>
      <ReviewHeader
        mediaType={mediaType.toLowerCase() as any}
        reviewId={id}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        createdAt={createdAt}
        isHelpful={isHelpful}
        user={user}
        commentCount={commentCount}
        watchStatus={watchStatus}
        episodeWatched={episodeWatched}
        hasCompleted={hasCompleted}
        totalEpisodes={totalEpisodes}
      />
      <Box sx={{ paddingX: 2, marginTop: 2 }}>
        <ReviewRatingCard
          storyRating={storyRating}
          actingRating={actingRating}
          musicRating={musicRating}
          overallRating={overallRating}
          rewatchValueRating={rewatchValueRating}
        />
        <ReviewBody reviewId={id} content={content} headline={headline} hasSpoilers={hasSpoilers} />

        <AddHelpfulRatingButtons reviewId={id} isHelpful={isHelpful} />
      </Box>
    </Box>
  );
};

export default OverallReviewCard;
