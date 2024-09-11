import React from 'react';
import { getExtendedReview, getExtendedUserReviews } from '@/features/reviews/services/reviewAdvancedService';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import Typography from '@mui/material/Typography';
import UserReviewCard from '../../cards/UserReview';
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
  username: string;
}
const SingleReview: React.FC<SingleReviewProps> = async ({ reviewId, userId, username }) => {
  const review = await getExtendedReview(reviewId);
  if (!review || review.userId !== userId)
    return (
      <Typography fontSize={14} fontWeight={400} paddingX={2}>
        {`No Review found with id ${reviewId}`}
      </Typography>
    );

  return <UserReviewCard review={review} username={username} />;
};
const UserReviewDetails: React.FC<UserReviewDetailsProps> = async ({
  reviewId,
  reviewType = ReviewType.OVERALL,
  userId,
  username
}) => {
  if (reviewId) return <SingleReview reviewId={reviewId} userId={userId} username={username} />;

  const reviews = await getExtendedUserReviews(userId, reviewType);

  return <AllReviews view="user" reviews={reviews as any} reviewType={reviewType} username={username} />;
};

export default UserReviewDetails;
