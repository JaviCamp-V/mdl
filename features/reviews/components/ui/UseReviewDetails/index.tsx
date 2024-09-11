import React from 'react';
import { getExtendedReview, getExtendedUserReviews } from '@/features/reviews/services/reviewAdvancedService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import Typography from '@mui/material/Typography';
import EpisodeReviewCard from '../../cards/EpsiodeReview';
import OverallReviewCard from '../../cards/OverallReview';
import AllReviews from '../AllReviews';

interface UserReviewDetailsProps {
  userId: number;
  username: string;
  reviewType?: ReviewType;
  reviewId?: number;
}
interface SingleReviewProps {
  reviewId: number;
  userId: number;
}
const SingleReview: React.FC<SingleReviewProps> = async ({ reviewId, userId }) => {
  const review = await getExtendedReview(reviewId);
  if (!review || review.userId !== userId)
    return (
      <Typography fontSize={14} fontWeight={400} paddingX={2}>
        {`No Review found with id ${reviewId}`}
      </Typography>
    );

  return review.reviewType === ReviewType.EPISODE ? (
    <EpisodeReviewCard review={review} />
  ) : (
    <OverallReviewCard review={review} />
  );
};
const UserReviewDetails: React.FC<UserReviewDetailsProps> = async ({
  reviewId,
  reviewType = ReviewType.OVERALL,
  userId,
  username
}) => {
  if (reviewId) return <SingleReview reviewId={reviewId} userId={userId} />;

  const reviews = await getExtendedUserReviews(userId, reviewType);

  return <AllReviews view="user" reviews={reviews as any} reviewType={reviewType} username={username} />;
};

export default UserReviewDetails;
