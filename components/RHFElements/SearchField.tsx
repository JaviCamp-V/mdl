'use client';

import React from 'react';
import { Popover } from 'react-tiny-popover';
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField, { TextFieldProps } from './TextField';

type SearchFieldProps = TextFieldProps & {
  fieldColor: string;
  borderColor: string;
};

const SearchInput: React.FC<SearchFieldProps> = ({ fieldColor, borderColor, sx, ...props }) => {
  return (
    <TextField
      size="small"
      hideError
      {...props}
      sx={{
        ...sx,
        '& .MuiInputBase-root': {
          backgroundColor: fieldColor, // Change background color here
          paddingRight: '0 !important', // Adjust padding-right to zero,
          color: '#fff' // Change text color here,
        },
        '& input': {
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${fieldColor} inset`, // Prevent autofill from changing background
            WebkitTextFillColor: '#fff' // Adjust text color if needed
          }
        },
        '& .MuiInputBase-input': {
          paddingRight: 2 // Add padding before the endAdornment
        },

        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: borderColor // Default border color
            // borderRight: 'none'
          },
          '&:hover fieldset': {
            borderColor: borderColor // Border color on hover
            // borderRight: 'none'
          },
          '&.Mui-focused fieldset': {
            borderColor: borderColor // Border color when focused
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
            <IconButton type="submit">
              <SearchIcon
                sx={{
                  fontSize: 22,
                  color: '#fff'
                }}
              />
            </IconButton>
          </Box>
        )
      }}
    />
  );
};

const SearchField: React.FC<TextFieldProps> = (props) => {
  const [isSearchFieldOpen, setIsSearchFieldOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%' }}>
      {isMobile ? (
        <ClickAwayListener onClickAway={() => setIsSearchFieldOpen(false)}>
          <Box>
            <Popover
              isOpen={isSearchFieldOpen}
              positions={['bottom']} // preferred positions
              padding={8} // space between the target and popover content
              containerStyle={{
                backgroundColor: '#242526',
                boxShadow: '0 1px 1px rgba(0,0,0,.1)',
                border: '1px solid rgba(0, 0, 0, .14)',
                width: '100vw',
                height: '12vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }} // custom styles for the popover content container
              content={
                <Box
                  sx={{
                    width: '100vw',
                    padding: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <SearchInput
                    {...props}
                    fieldColor="#3a3b3c"
                    borderColor="#242526"
                    sx={{ width: '95vw!important', fontSize: 20 }}
                  />
                </Box>
              }
            >
              <IconButton onClick={() => setIsSearchFieldOpen((prev) => !prev)}>
                <SearchIcon
                  sx={{
                    fontWeight: 900,
                    fontSize: 28,
                    color: '#fff'
                  }}
                />
              </IconButton>
            </Popover>
          </Box>
        </ClickAwayListener>
      ) : (
        <SearchInput {...props} fieldColor="#1a71a7" borderColor="#337daa" />
      )}
    </Box>
  );
};

export default SearchField;
