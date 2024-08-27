import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormLabel, Grid } from '@mui/material';
import { FieldGroup } from '@/types/common/IForm';

const GroupField: React.FC<FieldGroup> = ({ name, label, fields, FieldSelector }) => {
  return (
    <Grid container spacing={2}>
      {label && (
        <Grid item xs={12}>
          <FormLabel>{label}</FormLabel>
        </Grid>
      )}
      {Object.values(fields ?? {}).map((field) => (
        <Grid item key={field.name} xs={field.breakpoints?.xs}>
          <FieldSelector {...field} name={`${name}[${field.name}]`} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GroupField;
