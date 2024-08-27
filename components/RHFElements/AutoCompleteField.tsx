'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Field } from '@/types/common/IForm';
import { textFieldStyles } from './sxProps';


interface AutoCompleteFieldProps extends Field {
  options: { value: any; label: string; disabled: boolean }[];
}
const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({ name, errorMessages, options, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...rest}
          {...field}
          multiple={false}
          value={options.find((option) => option.value === field.value) ?? null}
          options={options}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(e, newValue) => field.onChange(newValue ? newValue.value : null)}
          renderInput={(params) => (
            <TextField {...params} error={Boolean(error)} helperText={error?.message} sx={{ ...textFieldStyles }} />
          )}
          fullWidth
        />
      )}
    />
  );
};

export default AutoCompleteField;