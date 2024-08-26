'use client';

import React from 'react';
import { MenuItem } from '@mui/material';
import { Field } from '@/types/common/IForm';
import TextField from './TextField';

interface SelectFieldProps extends Field {
  options: { value: any; label: string; disabled: boolean }[];
}
const SelectField: React.FC<SelectFieldProps> = ({ name, options, errorMessages, ...rest }) => {
  const isRequired = !!errorMessages?.required;
  return (
    <TextField
      {...rest}
      name={name}
      select
    >
      {!isRequired && (
        <MenuItem value="" color="disabled" sx={{ fontSize: '14px!important' }}>{`Select ${rest.label}`}</MenuItem>
      )}
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          sx={{ fontSize: '14px!important' }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;
