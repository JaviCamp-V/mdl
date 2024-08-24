import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { color } from '@/libs/common';
import SearchIcon from '../Icon/SearchIcon';
import TextField, { TextFieldProps } from './TextField';

type SearchFieldProps = TextFieldProps & {
  fieldColor: string;
  borderColor: string;
  onClick: () => void;
};

const SearchField: React.FC<SearchFieldProps> = ({ fieldColor, borderColor, sx, onClick, ...props }) => {
  return (
    <TextField
      size="small"
      hideError
      {...props}
      sx={{
        ...sx,
        '& .MuiInputBase-root': {
          backgroundColor: fieldColor,
          paddingRight: '0 !important',
          color: 'text.primary'
        },
        '& input': {
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${fieldColor} inset`,
            WebkitTextFillColor: 'text.primary'
          },
          fontSize: 14
        },
        '& .MuiInputBase-input': {
          paddingRight: 2,
          fontSize: '14px!important'
        },

        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: borderColor
            // borderRight: 'none'
          },
          '&:hover fieldset': {
            borderColor: borderColor
            // borderRight: 'none'
          },
          '&.Mui-focused fieldset': {
            borderColor: borderColor
            // borderRight: 'none'
          }
        }
      }}
      InputProps={{
        endAdornment: (
          <Box
            sx={{
              borderLeft: `1.5px solid ${borderColor}`, // Add border to separate icon
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <IconButton onClick={onClick}>
              <SearchIcon
                sx={{
                  fontSize: 22,
                  color: color
                }}
              />
            </IconButton>
          </Box>
        )
      }}
    />
  );
};

export default SearchField;
