import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormLabel, Slider } from '@mui/material';
import { Field } from '@/types/common/IForm';

interface SliderFieldProps extends Field {}
const SliderField: React.FC<SliderFieldProps> = ({ name, options, label, errorMessages, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={Boolean(error)}>
          <FormLabel>{label}</FormLabel>
          <Slider
            {...field}
            {...rest}
            step={0.5}
            color="primary"
            onChange={(_, value) => field.onChange(value)}
            marks={options}
            valueLabelDisplay="on"
          />
          {error && <FormLabel error>{error?.message}</FormLabel>}
        </FormControl>
      )}
    />
  );
};

export default SliderField;
