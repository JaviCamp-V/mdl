import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Iconify from '@/components/Icon/Iconify';

interface RatingsProps {
  rating: number; // out of 10 rating
}
const Ratings: React.FC<RatingsProps> = ({ rating }) => {
  return (
    <Box>
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
    </Box>
  );
};

export default Ratings;
