'use client';

import React from 'react';
import IconButton from '@mui/material/IconButton';
import { card_background, color } from '@/libs/common';
import Iconify from '../Icon/Iconify';
import TextField, { TextFieldProps } from './TextField';

type PAsswordFieldProps = TextFieldProps & {};

const visibilityIcons = {
  text: 'material-symbols-light:visibility-off-outline-rounded',
  password: 'material-symbols-light:visibility-outline-rounded'
};
const PasswordField: React.FC<PAsswordFieldProps> = (props) => {
  const [type, setType] = React.useState<'password' | 'text'>('password');
  const toggleVisibility = () => setType((prev) => (prev === 'password' ? 'text' : 'password'));
  return (
    <TextField
      {...props}
      type={type}
      InputProps={{
        endAdornment: (
          <IconButton onClick={toggleVisibility}>
            <Iconify
              icon={visibilityIcons[type]}
              sx={{
                fontSize: 22,
                color: '#fff'
              }}
            />
          </IconButton>
        )
      }}
    />
  );
};

export default PasswordField;
