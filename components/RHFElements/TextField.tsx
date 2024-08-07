import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';

export type TextFieldProps = MuiTextFieldProps & {
  name: string;
  label?: string;
  placeholder?: string;
  hideError?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({ name, hideError, ...props }) => {
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
        <MuiTextField {...field} {...props} error={Boolean(!hideError && !!error)} helperText={getHelperText(error)} />
      )}
    />
  );
};

export default TextField;
