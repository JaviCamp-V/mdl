import React from 'react';
import { SxProps, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Iconify from '@/components/Icon/Iconify';

interface RatingsProps {
  rating: number; // out of 10 rating
  showText?: boolean;
  sx?: SxProps;
}
const Ratings: React.FC<RatingsProps> = ({ rating, showText, sx }) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        gap: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        ...sx
      }}
    >
      <Rating
        name="read-only"
        value={Math.floor(rating / 2)}
        precision={1}
        readOnly
        sx={{
          '& .MuiRating-iconEmpty': {
            color: 'inherit'
          }
        }}
        icon={<Iconify icon="ic:round-star" fontSize={'14px!important'} />}
        emptyIcon={<Iconify icon="ic:round-star-outline" fontSize={'14px!important'} />}
      />
      {showText && <Typography fontSize={'14px'}>{`${rating.toFixed(1)}/10`}</Typography>}
    </Box>
  );
};

export default Ratings;
