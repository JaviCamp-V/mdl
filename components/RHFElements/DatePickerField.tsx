import React from 'react';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Field } from '@/types/common/IForm';

interface DatePickerFieldProps extends Field {}
const DatePickerField: React.FC<DatePickerFieldProps> = ({ name, maxDate, minDate, sx, ...rest }) => {
  const { control } = useFormContext();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            {...field}
            {...rest}
            value={dayjs(field.value)}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            onChange={(date) => {
              field.onChange(date);
            }}
            slotProps={{
              textField: {
                helperText: error ? error.message : null,
                error: !!error,
                fullWidth: true,
                sx: {
                  '& .MuiInputLabel-root': {
                    fontSize: '14px', // Change font size of the label text,
                    color: 'info.contrastText'
                  },
                  '& .MuiSelect-icon': {
                    color: 'info.contrastText' // Change the icon color
                  },
                  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                    color: 'info.contrastText' // Change the icon color
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  },
                  '& .MuiInputBase-root': {
                    backgroundColor: 'info.main', // Change background color here
                    // paddingRight: '0 !important', // Adjust padding-right to zero,
                    color: 'info.contrastText',
                    fontSize: '14px'
                  },
                  '& input': {
                    '&:-webkit-autofill': {
                      WebkitBoxShadow: `0 0 0 1000px info.main inset`, // Prevent autofill from changing background
                      WebkitTextFillColor: 'info.contrastText' // Adjust text color if needed
                    }
                  },

                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'background.paper' // Default border color
                      // borderRight: 'none'
                    },
                    '&:hover fieldset': {
                      borderColor: 'background.paper' // Border color on hover
                      // borderRight: 'none'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'background.paper' // Border color when focused
                      // borderRight: 'none'
                    }
                  },
                  ...sx
                }
              }
            }}
            format="YYYY/MM/DD"
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;