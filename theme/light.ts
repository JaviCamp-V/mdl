'use client';

import { Lato } from 'next/font/google';
import { ThemeOptions, createTheme } from '@mui/material/styles';

const lato = Lato({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '700'] });

const color = { dark: 'hsl(0deg 0% 100% / 87%)', light: 'rgb(0 0 0 / 87%)' };
const background = { dark: '#242526', light: '#f1f1f1' };

const light = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily
  },
  palette: {
    primary: {
      main: '#1675b6',
      contrastText: 'hsl(0,0%,100%)'
    },
    secondary: {
      main: '#176093'
    },
    background: {
      default: 'hsl(225,10%,92.16%)',
      paper: 'hsl(0,0%,100%)'
    },
    text: {
      primary: 'rgb(0 0 0 / 87%)',
      secondary: 'rgb(0 0 0 / 87%)'
    }
  }
});

export default light;
