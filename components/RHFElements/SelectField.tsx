import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Field } from '@/types/common/IForm';

interface SelectFieldProps extends Field {
  options: { value: any; label: string; disabled: boolean }[];
}
const SelectField: React.FC<SelectFieldProps> = ({ name, options, errorMessages, ...rest }) => {
  const { control } = useFormContext();
  const isRequired = !!errorMessages?.required;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth>
          {rest.label && <InputLabel>{rest.label}</InputLabel>}
          <Select {...field} {...rest}>
            {!isRequired && <MenuItem value="">{rest.label}</MenuItem>}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
