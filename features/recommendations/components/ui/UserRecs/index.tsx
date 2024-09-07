import React from 'react';
import { getUsersSuggestions } from '@/features/recommendations/service/recommendationService';
import { Typography } from '@mui/material';
import UserRecommendationList from './RecList';

interface UserRecommendationsProps {
  userId: number;
}
const UserRecommendations: React.FC<UserRecommendationsProps> = async ({ userId }) => {
  const recommendations = await getUsersSuggestions(userId);
  if (!recommendations.length) {
    return (
      <Typography fontSize={14} paddingX={2}>
        There have been no recommendations submitted
      </Typography>
    );
  }

  return <UserRecommendationList recommendations={recommendations} />;
};

export default UserRecommendations;
