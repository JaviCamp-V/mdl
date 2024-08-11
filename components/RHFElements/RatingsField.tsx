import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Field } from '@/types/common/IForm';

interface RatingsProps extends Field {
  total?: number;
}
const Ratings: React.FC<RatingsProps> = ({ name, total }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <Rating {...field} name={name} />
          <Typography>
            <Typography component={'span'} fontWeight={'bolder'}>
              {field.value}
            </Typography>
            {` / ${total}`}
          </Typography>
        </Box>
      )}
    />
  );
};

export default Ratings;
