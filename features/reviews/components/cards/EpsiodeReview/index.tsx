import React from 'react';
import { ExtendedEpisodeReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import AddHelpfulRatingButtons from '../../buttons/AddHelpfulRating';
import ReviewBody from '../ReviewBody';
import EpisodeReviewHeader from './ReviewHeader';

interface EpisodeReviewCardProps {
  review: ExtendedEpisodeReview;
}
const EpisodeReviewCard: React.FC<EpisodeReviewCardProps> = ({ review }) => {
  const {
    user,
    id,
    createdAt,
    updatedAt,
    overallRating,
    content,
    headline,
    hasSpoilers,
    helpful: { numberOfHelpfulReviews, isHelpful }
  } = review;
  return (
    <Box sx={{ width: '100%' }}>
      <EpisodeReviewHeader
        reviewId={id}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        createdAt={createdAt}
        updatedAt={updatedAt}
        isHelpful={isHelpful}
        user={user}
        ratings={overallRating}
      />
      <Box sx={{ paddingX: 2, marginTop: 2 }}>
        <ReviewBody reviewId={id} content={content} headline={headline} hasSpoilers={hasSpoilers} />
        <AddHelpfulRatingButtons reviewId={id} isHelpful={isHelpful} />
      </Box>
    </Box>
  );
};

export default EpisodeReviewCard;
