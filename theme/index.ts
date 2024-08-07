'use client';

import { Lato } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const lato = Lato({ subsets: ['latin'], display: 'swap', weight: ['300', '400', '700'] });

const color = { dark: 'hsl(0deg 0% 100% / 87%)', light: 'rgb(0 0 0 / 87%)' };
const background = { dark: '#242526', light: '#f1f1f1' };

const theme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily
  },
  palette: {
    primary: {
      main: '#1675b6'
    }
  }
});

export default theme;
