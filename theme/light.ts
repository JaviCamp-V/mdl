'use client';

import { Lato } from 'next/font/google';
import { createTheme } from '@mui/material/styles';


const lato = Lato({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '700'] });

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
      main: '#2A2B3C'
    },
    background: {
      default: 'hsl(225,10%,92.16%)',
      paper: 'hsl(0,0%,100%)'
    },
    text: {
      primary: 'rgb(0 0 0 / 87%)',
      secondary: 'rgb(0 0 0 / 87%)'
    },
    info: {
      main: 'hsl(225,10%,92.16%)', // New info color
      contrastText: 'rgb(0 0 0 / 87%)' // Text color when the button is using info color
    }
  }
});

export default light;