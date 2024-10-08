'use client';

import { Lato } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const lato = Lato({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '700'] });

const dark = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily
  },
  components: {
    MuiDatePicker: {
      styleOverrides: {
        root: {
          backgroundColor: 'red'
        }
      }
    }
  } as any,
  palette: {
    primary: {
      main: '#2490da'
    },
    success: {
      main: '#5cb85c',
      contrastText: 'hsl(0deg 0% 100% / 87%)'
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
    },
    info: {
      main: '#3a3b3c', // New info color
      contrastText: 'hsl(0deg 0% 100% / 87%)' // Text color when the button is using info color
    }
  }
});

export default dark;
