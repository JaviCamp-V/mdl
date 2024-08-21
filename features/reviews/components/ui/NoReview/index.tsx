import React from 'react';
import Link from 'next/link';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';

interface NoReviewsProps extends MediaDetailsProps {
  containerStyle?: SxProps;
}
const NoReviews: React.FC<NoReviewsProps> = ({ mediaType, mediaId, containerStyle }) => {
  return (
    <Box padding={2} sx={{ ...containerStyle }}>
      <Typography fontSize={14} fontWeight={400}>
        There have been no reviews submitted .
        <Link href={`/${mediaType}/${mediaId}/reviews/new`} style={{ textDecoration: 'none' }} passHref>
          <Typography component="span" fontSize={14} color="#1675b6" textAlign={'center'}>
            {' Be the first to write a review'}
          </Typography>
        </Link>
      </Typography>
    </Box>
  );
};

export default NoReviews;
