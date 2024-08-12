import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import StarIcon from '@mui/icons-material/Star';
import { Box, FormControl, FormLabel, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Field } from '@/types/common/IForm';
import TextField from './TextField';

interface RatingsProps extends Field {
  total?: number;
}
const Ratings: React.FC<RatingsProps> = ({ name, total, label }) => {
  const { control } = useFormContext();
  const [hover, setHover] = React.useState(-1);

  return (
    <FormControl fullWidth>
      <FormLabel sx={{ marginBottom: 0.5, fontSize: '14px', color: 'info.contrastText' }}>{label}</FormLabel>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 2 }}>
        <Box sx={{ width: '25%' }}>
          <TextField
            name={name}
            type="number"
            size="small"
            inputProps={{ inputMode: 'numeric', min: 0, max: total, step: 0.5 }}
            fullWidth={false}
          />
        </Box>
        <Box sx={{ width: '75%' }}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <Rating
                  size={'large'}
                  value={Number(field.value) / 2}
                  name={name}
                  precision={0.5}
                  onChangeActive={(_, newHover) => {
                    console.log('newHover: ', newHover);
                    setHover(newHover);
                  }}
                  onChange={(_, newValue) => {
                    console.log('newValue: ', newValue);
                    field.onChange(newValue ? newValue * 2 : 0);
                  }}
                  sx={{
                    '& .MuiRating-iconEmpty': {
                      color: 'inherit'
                    }
                  }}
                />
                <Typography fontSize={'14px'}>
                  <Typography component={'span'} fontWeight={'bolder'}>
                    {hover !== -1 ? hover : field.value}
                  </Typography>
                  {` / ${total}`}
                </Typography>
              </Box>
            )}
          />
        </Box>
      </Box>
    </FormControl>
  );
};

export default Ratings;