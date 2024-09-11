import React from 'react';
import Typography from '@mui/material/Typography';
import ReviewContent from '../../typography/ReviewContent';

interface ReviewBodyProps {
  reviewId: number;
  content: string;
  headline: string;
  hasSpoilers?: boolean;
}
const ReviewBody: React.FC<ReviewBodyProps> = ({ reviewId, content, headline, hasSpoilers }) => {
  return (
    <React.Fragment>
      <Typography fontSize={14} fontWeight="bolder" marginY={1} lineHeight={1.5} sx={{ whiteSpace: 'pre-wrap' }}>
        {headline}
      </Typography>

      {hasSpoilers && (
        <Typography fontSize={14} color="error" fontWeight="bolder" marginY={1} lineHeight={1.5}>
          This review contains spoilers
        </Typography>
      )}
      <ReviewContent reviewId={reviewId} content={content} />
    </React.Fragment>
  );
};

export default ReviewBody;
