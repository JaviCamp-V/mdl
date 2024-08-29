import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import useAsync from '@/hooks/useAsync';
import useDebounce from '@/hooks/useDebounce';
import SearchIcon from '../Icon/SearchIcon';

export interface AsyncSearchFieldProps<T> {
  placeholder: any;
  value: T | null;
  searchFunction: (query: string) => Promise<T[]>;
  defaultResults: T[];
  renderResult: (data: T, props: any) => React.ReactNode;
  getOptionLabel: (option: T) => string;
  isEquals: (option: T, value: T) => boolean;
  onChange: (data: T | null) => void;
}

const Wrapper: React.FC<PaperProps> = ({ children, ...rest }) => {
  return (
    <Paper
      {...rest}
      sx={{
        position: 'relative',
        marginTop: 1,
        border: '1px solid #3e4042',
        borderRadius: '4px',
        bgcolor: 'background.paper',
        paddingY: 1
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: 40,
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: '10px solid #3e4042'
        }}
      />
      {children}
    </Paper>
  );
};

const AsyncSearchField = <T,>({
  placeholder,
  value,
  searchFunction,
  defaultResults,
  renderResult,
  onChange,
  getOptionLabel,
  isEquals
}: AsyncSearchFieldProps<T>) => {
  const [inputValue, setInputValue] = React.useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500);

  const wrapper = () => {
    if (!debouncedInputValue) return Promise.resolve(defaultResults);
    return searchFunction(debouncedInputValue);
  };

  const { data: options } = useAsync(wrapper, defaultResults, [debouncedInputValue]);
  return (
    <Autocomplete
      autoComplete={false}
      open={Boolean(options.length && debouncedInputValue)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      ListboxProps={{ sx: { scrollbarWidth: 'none' } }}
      PaperComponent={Wrapper}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isEquals}
      popupIcon={<Box sx={{ pointerEvents: 'none', cursor: 'not-allowed' }}>{<SearchIcon />}</Box>}
      renderOption={(props, option) => <React.Fragment key={props.key}>{renderResult(option, props)}</React.Fragment>}
      sx={{
        '& .MuiAutocomplete-popupIndicator': {
          color: 'info.contrastText'
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
          sx={{
            '& .MuiInputBase-root': {
              backgroundColor: 'info.main',
              color: 'info.contrastText',
              fontSize: '14px',
              height: '40px'
            },
            '& input': {
              '&:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 1000px info.main inset`,
                WebkitTextFillColor: 'info.contrastText'
              }
            },
            '& .MuiInputLabel-root': {
              fontSize: '14px',
              color: 'info.contrastText'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none'
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            },
            '& .MuiSelect-icon': {
              color: 'info.contrastText'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'background.paper'
              },
              '&:hover fieldset': {
                borderColor: 'background.paper'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'background.paper'
              }
            },
            fontSize: '14px'
          }}
        />
      )}
      fullWidth
    />
  );
};

export default AsyncSearchField;
