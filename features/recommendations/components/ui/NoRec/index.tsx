import React from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import Link from '@/components/common/Link';
import MediaDetailsProps from '@/types/common/MediaDetailsProps';

const NoRecommendation: React.FC<MediaDetailsProps & { containerStyle?: SxProps }> = ({
  mediaId,
  mediaType,
  containerStyle
}) => {
  return (
    <Box padding={2} sx={{ ...containerStyle }}>
      <Typography fontSize={14} fontWeight={400}>
        There have been no recommendation submitted .
        <Link href={`/${mediaType}/${mediaId}/recommendations/new`} sx={{ fontWeight: 400 }}>
          {' Be the first to add a recommendation'}
        </Link>
      </Typography>
    </Box>
  );
};

export default NoRecommendation;
