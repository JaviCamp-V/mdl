import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { Field } from '@/types/common/IForm';
import Iconify from '../Icon/Iconify';

type CheckBoxFieldProps = CheckboxProps &
  Field & {
    name: string;
    type: 'checkbox';
    label?: string | React.ReactNode;
    icons?: { checked: string; unchecked: string };
    showLabel?: boolean;
  };

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  name,
  label,
  icons,
  showLabel = true,
  type,
  errorMessages,
  ...rest
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" variant="standard" error={Boolean(error)}>
          <FormControlLabel
            label={showLabel ? label : ''}
            control={
              <Checkbox
                icon={icons ? <Iconify icon={icons.checked} fontSize={'inherit'} /> : undefined}
                checkedIcon={icons ? <Iconify icon={icons.checked} fontSize={'inherit'} /> : undefined}
                {...field}
                {...rest}
              />
            }
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CheckBoxField;
