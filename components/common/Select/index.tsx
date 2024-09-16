import React from 'react';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


type SelectFieldProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};
const SelectField: React.FC<SelectFieldProps> = ({ onChange, value, options, disabled }) => {
  return (
    <FormControl>
      <Select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        sx={{
          '& .MuiSelect-select': {
            backgroundColor: 'info.main',
            color: '#fff!important',
            borderColor: 'info.main',
            fontSize: '14px',
            padding: 1.5
          },
          '& input': {
            '&:-webkit-autofill': {
              WebkitBoxShadow: `0 0 0 1000px info.main inset`,
              WebkitTextFillColor: 'info.contrastText'
            }
          },
          '& .MuiSelect-icon': {
            color: 'info.contrastText'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'info.main'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'info.main'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'info.main'
          }
        }}
      >
        {options.map((options) => (
          <MenuItem key={options.label} value={options.value}>
            {options.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;