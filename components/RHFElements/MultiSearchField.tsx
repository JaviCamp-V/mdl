import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Chip, FormHelperText, FormLabel } from '@mui/material';
import { Field } from '@/types/common/IForm';
import AsyncSearchField from './AsyncSearchField';

export interface MultiSearchFieldProps<T> extends Field {
  searchFunction: (query: string) => Promise<T[]>;
  defaultResults: T[];
  renderResult: (data: T, props: any) => React.ReactNode;
  getOptionLabel: (option: T) => string;
  isEquals: (option: T, value: T) => boolean;
}
const MultiSearchField: React.FC<MultiSearchFieldProps<any>> = ({
  name,
  searchFunction,
  defaultResults,
  renderResult,
  getOptionLabel,
  isEquals,
  label
}) => {
  const methods = useFormContext();
  const [value, setValue] = React.useState<any>(null);
  const { fields, remove, append } = useFieldArray({ name, control: methods.control });

  const onChange = (data: any) => {
    if (data) {
      append(data);
    }
    setValue(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {label && <FormLabel sx={{ marginBottom: 0.5 }}>{label}</FormLabel>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {fields.map((field, index) => (
          <Chip
            key={field.id}
            color="success"
            sx={{
              borderRadius: '4px',
              textTransform: 'capitalize',
              padding: 0.2,
              fontWeight: 700,
              height: 'max-content'
            }}
            label={getOptionLabel(field)}
            onDelete={() => remove(index)}
          />
        ))}
      </Box>
      <AsyncSearchField
        searchFunction={searchFunction}
        defaultResults={defaultResults}
        renderResult={renderResult}
        getOptionLabel={getOptionLabel}
        isEquals={isEquals}
        value={value}
        onChange={onChange}
        placeholder={`Search for ${label}`}
      />
    </Box>
  );
};

export default MultiSearchField;
