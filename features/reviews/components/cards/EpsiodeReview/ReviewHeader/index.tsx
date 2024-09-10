import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Ratings from '@/components/common/Ratings';
import UserSummary from '@/types/common/UserSummary';
import { formatDateToDistance } from '@/utils/formatters';
import ReviewHelpfulRatingCard from '../../ReviewHelpfulRating';

interface EpisodeReviewHeaderProps {
  reviewId: number;
  numberOfHelpfulReviews: number;
  createdAt: string;
  updatedAt: string;
  isHelpful: boolean | null | undefined;
  user: UserSummary;
  ratings: number;
}
const EpisodeReviewHeader: React.FC<EpisodeReviewHeaderProps> = ({
  reviewId,
  numberOfHelpfulReviews,
  isHelpful,
  ratings,
  createdAt,
  user
}) => {
  return (
    <Box
      id={`review-${reviewId}`}
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
      <ReviewHelpfulRatingCard user={user} numberOfHelpfulReviews={numberOfHelpfulReviews} isHelpful={isHelpful} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 0.2 }}
      >
        <Typography fontSize={12} fontWeight={'bolder'} sx={{ opacity: 0.6, display: { xs: 'none', md: 'flex' } }}>
          {formatDateToDistance(createdAt)}
        </Typography>
        <Ratings rating={ratings} />
      </Box>
    </Box>
  );
};

export default EpisodeReviewHeader;
