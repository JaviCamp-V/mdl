import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import StarIcon from '@mui/icons-material/Star';
import { Box, FormControl, FormHelperText, FormLabel, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Field } from '@/types/common/IForm';
import TextField from './TextField';

interface RatingsProps extends Field {
  total?: number;
  showInput?: boolean;
}
const Ratings: React.FC<RatingsProps> = ({ name, total, label, max, disabled, showInput = true }) => {
  const { control, formState } = useFormContext();
  const [hover, setHover] = React.useState(-1);

  const hasError = name in formState.errors && name in formState.touchedFields;
  return (
    <FormControl fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: showInput ? 'column' : 'row',
          gap: 2,
          alignItems: showInput ? 'flex-start' : 'center',
          justifyContent: 'left'
        }}
      >
        <FormLabel sx={{ marginBottom: 0.5, fontSize: '14px', color: 'info.contrastText' }}>{label}</FormLabel>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 2 }}>
          {showInput && (
            <Box sx={{ width: '25%' }}>
              <TextField
                name={name}
                type="number"
                size="small"
                inputProps={{ inputMode: 'numeric', min: 0, max: total, step: 0.5 }}
                fullWidth={false}
                disabled={disabled}
                hideError
              />
            </Box>
          )}
          <Box sx={{ width: showInput ? '75%' : '100%' }}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Rating
                    size={'large'}
                    value={Number(field.value) / 2}
                    name={name}
                    disabled={disabled}
                    precision={0.1}
                    onChangeActive={(_, newHover) => {
                      setHover(newHover !== -1 ? newHover * 2 : -1);
                    }}
                    onChange={(_, newValue) => {
                      field.onChange(newValue ? newValue * 2 : 0);
                    }}
                    sx={{
                      '& .MuiRating-iconEmpty': {
                        color: 'inherit'
                      }
                    }}
                  />
                  <Typography fontSize={'14px'}>
                    <Typography component={'span'} fontWeight={'bolder'} fontSize={'14px'}>
                      {hover !== -1 ? hover : field.value}
                    </Typography>
                    {`/${total || max}`}
                  </Typography>
                </Box>
              )}
            />
          </Box>
        </Box>
        {hasError && (
          <FormHelperText sx={{ color: 'error.main' }}>{`${(formState.errors as any)[name]?.message}`}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
};

export default Ratings;