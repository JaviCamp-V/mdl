import React from 'react';
import { Controller, Form, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormLabel } from '@mui/material';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { Field } from '@/types/common/IForm';


export type TextFieldProps = MuiTextFieldProps &
  Field & {
    name: string;
    label?: string | React.ReactNode;
    placeholder?: string;
    hideError?: boolean;
  };

const TextField: React.FC<TextFieldProps> = ({ name, hideError, label, sx, ...props }) => {
  const { control } = useFormContext();
  const getHelperText = (error: any) => {
    if (error && !hideError) return error.message;
    return props.helperText;
  };

  console.log('TextField: ', name, sx);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth>
          {/* {label && <FormLabel sx={{ paddingBottom: 0.5, fontSize: '14px' }}>{label}</FormLabel>} */}
          <MuiTextField
            sx={{
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
              '& .MuiInputLabel-root': {
                fontSize: '14px', // Change font size of the label text,
                color: 'info.contrastText'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              },
              '& .MuiSelect-icon': {
                color: 'info.contrastText' // Change the icon color
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
              ...sx,
              fontSize: '14px'
            }}
            label={label}
            {...field}
            {...props}
            error={Boolean(!hideError && !!error)}
            helperText={getHelperText(error)}
          />
        </FormControl>
      )}
    />
  );
};

export default TextField;