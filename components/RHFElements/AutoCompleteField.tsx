'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Field } from '@/types/common/IForm';

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
          // inputValue={inputValue}
          // onInputChange={(event, newInputValue) => {
          //   setInputValue(newInputValue);
          // }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Controllable" error={Boolean(error)} helperText={error?.message} />
          )}
        />
      )}
    />
  );
};

export default AutoCompleteField;
