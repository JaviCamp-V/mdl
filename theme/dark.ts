'use client';

import { Lato } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const lato = Lato({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '700'] });

const dark = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily
  },

  palette: {
    primary: {
      main: '#2490da'
    },
    secondary: {
      main: '#101112'
    },
    background: {
      default: '#18191A',
      paper: '#242526'
    },
    text: {
      primary: 'hsl(0deg 0% 100% / 87%)',
      secondary: 'hsl(0deg 0% 100% / 60%)'
    }
  }
});

export default dark;