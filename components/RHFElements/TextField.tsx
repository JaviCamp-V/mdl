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

const TextField: React.FC<TextFieldProps> = ({
  name,
  hideError,
  label,
  sx,
  min,
  max,
  inputProps,
  errorMessages,
  ...props
}) => {
  const { control } = useFormContext();
  const getHelperText = (error: any) => {
    if (error && !hideError) return error.message;
    return props.helperText;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth>
          <MuiTextField
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'info.main',
                color: 'info.contrastText',
                fontSize: '14px'
              },
              '& input': {
                paddingX: '10px',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: `0 0 0 1000px info.main inset`,
                  WebkitTextFillColor: 'info.contrastText'
                }
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
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
                color: 'info.contrastText'
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'background.paper'
                },
                '&:hover fieldset': {
                  borderColor: 'background.paper'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'background.paper'
                }
              },
              ...sx,

              fontSize: '14px'
            }}
            label={label}
            {...field}
            {...props}
            inputProps={{
              ...inputProps,
              min,
              max
            }}
            error={Boolean(!hideError && !!error)}
            helperText={getHelperText(error)}
          />
        </FormControl>
      )}
    />
  );
};

export default TextField;
