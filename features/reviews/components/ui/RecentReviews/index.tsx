import React from 'react';
import { getRecentReviews } from '@/features/reviews/services/reviewService';
import { ExtendOverallReviewWithMedia } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Carousel from '@/components/Carousel/swiper/index';
import Divider from '@/components/common/Divider';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import ReviewSummaryCard from '../../cards/ReviewSummary';

interface RecentReviewsCarouselProps {
  containerStyle?: React.CSSProperties;
}
const RecentReviewsCarousel: React.FC<RecentReviewsCarouselProps> = async ({ containerStyle }) => {
  const reviews = await getRecentReviews();
  if ('errors' in reviews || reviews.length === 0) return;

  return (
    <Box paddingY={0}>
      <Typography
        sx={{
          paddingX: 2,
          marginBottom: 2,
          fontSize: 18,
          fontWeight: 700
        }}
      >
        Recent Reviews
      </Typography>
      <React.Suspense fallback={<LoadingSkeleton width={'100%'} height={'30vh'} />}>
        <Box marginX={2} sx={{ minHeight: '30vh' }}>
          <Carousel>
            {reviews?.map((review: ExtendOverallReviewWithMedia) => (
              <ReviewSummaryCard key={review.id} review={review} />
            ))}
          </Carousel>
        </Box>
      </React.Suspense>
      <Divider />
    </Box>
  );
};

export default RecentReviewsCarousel;
