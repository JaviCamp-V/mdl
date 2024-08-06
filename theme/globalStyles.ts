'use client';

import { css } from '@emotion/react';

const color = { dark: 'hsl(0deg 0% 100% / 87%)', light: 'rgb(0 0 0 / 87%)' };
const background = { dark: '#242526', light: '#f1f1f1' };

const globalStyles = css`
  :root {
    body {
      background-color: #f1f1f1;
      color: rgb(0 0 0 / 87%);
    }
  }
  [data-theme='dark'] {
    body {
      background-color: #18191A';
      color: hsl(0deg 0% 100% / 87%);
    }
  }
`;
export default globalStyles;
