import React from 'react';
import Typography from '@mui/material/Typography';

interface RecommendationReasonProps {
  reason: string;
}
const RecommendationReason: React.FC<RecommendationReasonProps> = ({ reason }) => {
  return (
    <Typography
      fontSize={14}
      lineHeight={1.5}
      sx={{
        whiteSpace: 'pre-wrap'
      }}
    >
      {reason}
    </Typography>
  );
};

export default RecommendationReason;
