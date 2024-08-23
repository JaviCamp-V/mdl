'use client';

import React from 'react';
import { SnackbarProvider } from 'notistack';

const NonStickSnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      preventDuplicate
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      dense
    >
      {children}
    </SnackbarProvider>
  );
};

export default NonStickSnackbarProvider;
