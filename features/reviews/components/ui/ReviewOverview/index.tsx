import React from 'react';
import { ExtendOverallReview } from '@/features/reviews/types/interfaces/ExtendReviewResponse';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@/components/common/Divider';
import Link from '@/components/common/Link';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import OverallReviewCard from '../../cards/OverallReview';
import NoReviews from '../NoReview';

interface ReviewsSummaryProps extends MediaDetailsProps {
  reviews: ExtendOverallReview[];
  totalEpisodes?: number;
  userReviewId?: number | null;
}
const ReviewOverview: React.FC<ReviewsSummaryProps> = ({
  reviews,
  mediaId,
  mediaType,
  totalEpisodes,
  userReviewId
}) => {
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
        <Link
          href={`/${mediaType}/${mediaId}/reviews/${userReviewId ? 'edit' : 'new'}`}
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: '#1675b6',
            textAlign: 'center'
          }}
        >
          {`${userReviewId ? 'Edit' : 'Write a'}  review`}
        </Link>
      </Box>
      <Divider marginBottom={0} />
      {reviews.length === 0 ? (
        <NoReviews mediaId={mediaId} mediaType={mediaType} />
      ) : (
        <React.Fragment>
          <Grid
            container
            spacing={0}
            sx={{ borderRight: '1px solid hsla(210,8%,51%,.13)', borderLeft: '1px solid hsla(210,8%,51%,.13)' }}
          >
            {reviews.map((review: ExtendOverallReview, index: number, arr) => (
              <Grid
                item
                xs={12}
                key={review.id}
                sx={{ borderBottom: index !== arr.length - 1 ? '1px solid hsla(210,8%,51%,.13)' : 'none' }}
              >
                <OverallReviewCard review={review} totalEpisodes={totalEpisodes} />
              </Grid>
            ))}
          </Grid>
          <Divider marginTop={0} />
          <Box paddingX={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link href={`/${mediaType}/${mediaId}/reviews`} sx={{ fontSize: 14, fontWeight: 400 }}>
              View all
            </Link>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

export default ReviewOverview;