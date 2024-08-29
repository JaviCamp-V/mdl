import React from 'react';
import { Controller, FieldError, useFieldArray, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, Typography } from '@mui/material';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { Field } from '@/types/common/IForm';
import Iconify from '../Icon/Iconify';

interface CheckboxInputProps {
  icons?: { checked: string; unchecked: string };
}
interface CheckBoxFieldProps extends CheckboxProps, CheckboxInputProps, Field {
  name: string;
  label?: string | React.ReactNode;
  showLabel?: boolean;
  control?: any;
}

const CheckboxInput: React.FC<CheckBoxFieldProps> = ({ icons, name, showLabel, label, ...rest }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" variant="standard" error={Boolean(error)}>
          <FormControlLabel
            label={showLabel ? label : ''}
            componentsProps={{
              typography: { fontSize: '14px!important', color: 'info.contrastText', whiteSpace: 'nowrap' }
            }}
            sx={{}}
            control={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  sx={{ paddingY: 0 }}
                  icon={icons ? <Iconify icon={icons.checked} fontSize={'inherit'} /> : undefined}
                  checkedIcon={icons ? <Iconify icon={icons.checked} fontSize={'inherit'} /> : undefined}
                  {...field}
                  checked={field.value}
                  {...rest}
                />
              </Box>
            }
          />
          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

const MultipleCheckBoxInput: React.FC<CheckBoxFieldProps> = ({ icons, name, showLabel, label, options, ...rest }) => {
  const { control } = useFormContext();
  const { fields } = useFieldArray({ name, control });

  return (
    <Grid container spacing={0.5}>
      {label && (
        <Grid item xs={12}>
          <FormLabel> {label}</FormLabel>
        </Grid>
      )}
      {fields.map((field, index) => (
        <Grid item key={field.id} xs={6}>
          <CheckboxInput
            {...rest}
            label={options![index].label}
            showLabel
            icons={icons}
            name={`${name}.${index}.checked`}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({ multiple, options, ...props }) => {
  if (multiple && options?.length) return <MultipleCheckBoxInput {...props} options={options} multiple />;

  return <CheckboxInput {...props} />;
};

export default CheckBoxField;
