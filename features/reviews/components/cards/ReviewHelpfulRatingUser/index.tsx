import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@/components/common/Avatar';
import UserSummary from '@/types/common/UserSummary';
import routes from '@/libs/routes';
import ReviewHelpfulRatingCard from '../ReviewHelpfulRating';

interface ReviewRatingCardProps {
  user: UserSummary;
  numberOfHelpfulReviews: number;
  isHelpful: boolean | null | undefined;
}
const ReviewHelpfulRatingUserCard: React.FC<ReviewRatingCardProps> = ({ user, numberOfHelpfulReviews, isHelpful }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.2, justifyContent: 'flex-start', alignItems: 'center' }}>
      <Avatar
        sx={{ width: 50, height: 50, fontsize: 30, fontWeight: 700 }}
        src={user.avatarUrl ?? undefined}
        username={user.username}
      />
      <ReviewHelpfulRatingCard
        title={user.displayName}
        titleLink={`${routes.user.profile?.replace('{username}', user.username.toLowerCase())}/reviews`}
        numberOfHelpfulReviews={numberOfHelpfulReviews}
        isHelpful={isHelpful}
        username={user.username}
      />
    </Box>
  );
};

export default ReviewHelpfulRatingUserCard;
