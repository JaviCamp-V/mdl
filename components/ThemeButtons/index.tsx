import React from 'react';
import Box from '@mui/material/Box';
import LightDarkButtons from './buttons';

const ThemeButtons = () => {
  // const cookieStore = cookies();
  // const theme = cookieStore.get('theme');
  return <LightDarkButtons theme={'dark'} />;
};

export default ThemeButtons;
