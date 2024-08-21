import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import { FieldModel } from '@/types/common/IForm';
import Values from '@/types/common/Values';
import RHFElementsSelector from '.';

interface RHFFormProps {
  fields: FieldModel;
  methods: UseFormReturn<any>;
  spacing?: number;
}
const RHFForm: React.FC<RHFFormProps> = ({ fields, methods, spacing }) => {
  return (
    <FormProvider {...methods}>
      <form>
        <Grid container spacing={spacing ?? 2}>
          {Object.values(fields).map((field) => (
            <Grid key={field.name} item {...field?.breakpoints}>
              <RHFElementsSelector {...field} fullWidth />
            </Grid>
          ))}
        </Grid>
      </form>
    </FormProvider>
  );
};

export default RHFForm;
