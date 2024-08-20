import React from 'react';
import Link from 'next/link';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import { OverallReview } from '@/features/reviews/types/interfaces/ReviewResponse';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@/components/common/Divider';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import MediaType from '@/types/tmdb/IMediaType';
import OverallReviewCard from '../../cards/OverallReviewCard';
import NoReviews from '../NoReview';

interface ReviewsSummaryProps extends MediaDetailsProps {
  reviews: ExtendOverallReview[];
}
const ReviewOverview: React.FC<ReviewsSummaryProps> = ({ reviews, mediaId, mediaType }) => {
  return (
    <Box sx={{ paddingY: 2 }}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          paddingX: 2,
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <Typography fontSize={16} fontWeight={700} lineHeight={1}>
          Reviews
        </Typography>
        <Link href={`/${mediaType}/${mediaId}/reviews/new`} style={{ textDecoration: 'none' }} passHref>
          <Typography fontSize={13} fontWeight={700} color="#1675b6" textAlign={'center'}>
            Write Review
          </Typography>
        </Link>
      </Box>
      <Divider marginBottom={0} />
      {reviews.length === 0 ? (
        <NoReviews mediaId={mediaId} mediaType={mediaType} />
      ) : (
        <React.Fragment>
          <Grid container spacing={2} sx={{}}>
            {reviews.map((review: ExtendOverallReview) => (
              <Grid item xs={12} key={review.id}>
                <OverallReviewCard review={review} />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Box paddingX={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link href={`/${mediaType}/${mediaId}/reviews`} passHref style={{ textDecoration: 'none' }}>
              <Typography color="primary">View all</Typography>
            </Link>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default ReviewOverview;
