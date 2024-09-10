'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ReviewType from '@/features/reviews/types/enums/ReviewType';
import { Link, SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';
import { formatDigitsWithPadding } from '@/utils/formatters';
import WriteReviewFormModal from '../../modals/WriteFormModal';

interface NoReviewsProps extends MediaDetailsProps {
  containerStyle?: SxProps;
  reviewType?: ReviewType;
  seasonNumber?: number;
  episodeNumber?: number;
  formMode?: 'modal' | 'page';
}
const NoReviews: React.FC<NoReviewsProps> = ({
  mediaType,
  mediaId,
  containerStyle,
  reviewType = ReviewType.OVERALL,
  seasonNumber = 0,
  episodeNumber = 0,
  formMode = reviewType === ReviewType.EPISODE ? 'modal' : 'page'
}) => {
  const router = useRouter();
  const [isReviewFormModalOpen, setIsReviewFormModalOpen] = React.useState(false);
  const baseUrl = `/${mediaType}/${mediaId}`;
  const reviewUrl =
    reviewType === ReviewType.EPISODE
      ? `/episode-guide/s${formatDigitsWithPadding(seasonNumber!, 2)}-ep${formatDigitsWithPadding(episodeNumber!, 2)}/new`
      : '/reviews/new';

  const handleWriteReview = () => {
    if (formMode === 'page') return router.push(`${baseUrl}${reviewUrl}`);
    setIsReviewFormModalOpen(true);
  };

  return (
    <Box padding={2} sx={{ ...containerStyle }}>
      <Typography fontSize={14} fontWeight={400}>
        There have been no reviews submitted .
        <Link
          sx={{
            textDecoration: 'none',
            fontSize: 14,
            color: '#1675b6',
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            pointerEvents: 'auto'
          }}
          onClick={handleWriteReview}
        >
          {' Be the first to write a review'}
        </Link>
      </Typography>
      {formMode === 'modal' && isReviewFormModalOpen && (
        <WriteReviewFormModal
          open={isReviewFormModalOpen}
          mediaId={mediaId}
          mediaType={mediaType}
          reviewType={reviewType as any}
          seasonNumber={seasonNumber}
          episodeNumber={episodeNumber}
          onClose={() => setIsReviewFormModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default NoReviews;
