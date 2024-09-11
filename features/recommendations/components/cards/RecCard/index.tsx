import React from 'react';
import Box from '@mui/material/Box';
import RecommendationReason from '../../typography/Reason';
import RecommendationCardFooter from '../CardFooter';

interface RecommendationCardProps {
  hasUserLiked: boolean;
  numberOfLikes: number;
  username?: string;
  displayName?: string;
  recommendationID: number;
  createdAt: string;
  reason: string;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  hasUserLiked,
  numberOfLikes,
  username,
  displayName,
  recommendationID,
  createdAt,
  reason
}) => (
  <Box sx={{ backgroundColor: 'background.default', padding: 2, width: '100%' }}>
    <RecommendationReason reason={reason} />
    <RecommendationCardFooter
      hasUserLiked={hasUserLiked}
      numberOfLikes={numberOfLikes}
      username={username}
      displayName={displayName}
      recommendationID={recommendationID}
      createdAt={createdAt}
    />
  </Box>
);

export default RecommendationCard;
