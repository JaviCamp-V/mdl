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

interface MediaNoReviewsProps extends MediaDetailsProps {
  containerStyle?: SxProps;
  reviewType?: ReviewType;
  seasonNumber?: number;
  episodeNumber?: number;
  formMode?: 'modal' | 'page';
  view: 'media';
}

interface UserNoReviewsProps {
  containerStyle?: SxProps;
  reviewType: ReviewType;
  view: 'user';
}

type NoReviewsProps = MediaNoReviewsProps | UserNoReviewsProps;

const NoReviews: React.FC<NoReviewsProps> = (props) => {
  const { containerStyle, reviewType = ReviewType.OVERALL, view } = props;
  const router = useRouter();
  const [isReviewFormModalOpen, setIsReviewFormModalOpen] = React.useState(false);

  const handleWriteReview = () => {
    if (view === 'user') return;

    const {
      mediaId,
      mediaType,
      seasonNumber,
      episodeNumber,
      formMode = reviewType == ReviewType.EPISODE ? 'modal' : 'page'
    } = props;

    if (formMode === 'modal') return setIsReviewFormModalOpen(true);
    const baseUrl = `/${mediaType}/${mediaId}`;
    const reviewUrl =
      reviewType === ReviewType.EPISODE
        ? `/episode-guide/s${formatDigitsWithPadding(seasonNumber!, 2)}-ep${formatDigitsWithPadding(episodeNumber!, 2)}/new`
        : '/reviews/new';
    return router.push(`${baseUrl}${reviewUrl}`);
  };

  return (
    <Box padding={2} sx={{ ...containerStyle }}>
      <Typography fontSize={14} fontWeight={400}>
        {`There have been no ${view === 'user' ? reviewType.toLowerCase() + ' ' : ''}reviews submitted .`}
        {view === 'media' && (
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
        )}
      </Typography>
      {view === 'media' && props.formMode === 'modal' && isReviewFormModalOpen && (
        <WriteReviewFormModal
          open={isReviewFormModalOpen}
          mediaId={props.mediaId}
          mediaType={props.mediaType}
          reviewType={reviewType as any}
          seasonNumber={props.seasonNumber}
          episodeNumber={props.episodeNumber}
          onClose={() => setIsReviewFormModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default NoReviews;