'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Iconify from '@/components/Icon/Iconify';
import { scrollToTopById } from '@/utils/scrollToElement';


interface ReviewContentProps {
  reviewId: number;
  content: string;
}
const minContent = 4;
const ReviewContent: React.FC<ReviewContentProps> = ({ content, reviewId }) => {
  const [isReadMore, setIsReadMore] = React.useState(false);
  const text = isReadMore ? content : content.split('\n').slice(0, minContent).join('\n');

  const handleReadMore = (value: boolean) => {
    setIsReadMore(value);
    if (!value) scrollToTopById(`review-${reviewId}`);
  };
  return (
    <React.Fragment>
      <Typography
        fontSize={14}
        lineHeight={1.5}
        paddingBottom={1.5}
        sx={{ whiteSpace: 'pre-wrap' }}
        onClick={() => !isReadMore && handleReadMore(true)}
      >
        {text}
      </Typography>
      {content.split('\n').length > minContent && (
        <Box
          sx={{
            zIndex: 101,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundImage:
              'linear-gradient(180deg,var(--mdl-gradient-1),var(--mdl-gradient-2),var(--mdl-gradient-3))',
            width: '100%',
            padding: 0
          }}
        >
          <Iconify
            icon={`ic:round-keyboard-double-arrow-${isReadMore ? 'up' : 'down'}`}
            color="text.main"
            width={16}
            height={16}
            onClick={() => handleReadMore(!isReadMore)}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          />
          <Typography
            color={'primary'}
            onClick={() => handleReadMore(!isReadMore)}
            sx={{
              cursor: 'pointer',
              pointerEvents: 'auto',
              fontSize: 14,
              fontWeight: 700
            }}
          >
            {isReadMore ? 'Read less' : 'Read more'}
          </Typography>
        </Box>
      )}
    </React.Fragment>
  );
};

export default ReviewContent;