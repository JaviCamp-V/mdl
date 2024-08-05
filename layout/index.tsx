import React from 'react';
import { Box, Paper } from '@mui/material';
import Footer from './footer';
import Navbar from './navbar';

interface MainLayoutProps {
  children?: React.ReactNode;
}
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Navbar />
      <Paper
        sx={{
          backgroundColor: '#18191A',
          color: '#fff!important',
          paddingTop: 8,
          borderRadius: 0,
          paddingBottom: 4
        }}
      >
        {' '}
        {children}
      </Paper>
      <Footer />
    </React.Fragment>
  );
};

export default MainLayout;
